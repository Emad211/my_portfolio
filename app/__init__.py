from flask import Flask, request, session
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_babel import Babel
from flask_login import LoginManager
from config import Config

db = SQLAlchemy()
migrate = Migrate()
babel = Babel()
login = LoginManager()
login.login_view = 'admin.login'

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    db.init_app(app)
    migrate.init_app(app, db)
    def get_locale():
        if 'language' in session:
            return session['language']
        return request.accept_languages.best_match(app.config['LANGUAGES'])

    babel.init_app(app, locale_selector=get_locale)
    login.init_app(app)

    from app.main import bp as main_bp
    app.register_blueprint(main_bp)

    from app.admin import bp as admin_bp
    app.register_blueprint(admin_bp, url_prefix='/admin')

    return app
