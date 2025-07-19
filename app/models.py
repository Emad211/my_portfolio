from app import db, login
from flask_login import UserMixin
from werkzeug.security import generate_password_hash, check_password_hash

@login.user_loader
def load_user(id):
    return User.query.get(int(id))

class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(64), index=True, unique=True)
    password_hash = db.Column(db.String(128))

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def __repr__(self):
        return f'<User {self.username}>'

class Post(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title_en = db.Column(db.String(120), nullable=False)
    title_fa = db.Column(db.String(120), nullable=False)
    body_en = db.Column(db.Text, nullable=False)
    body_fa = db.Column(db.Text, nullable=False)
    timestamp = db.Column(db.DateTime, index=True, default=db.func.now())

    def __repr__(self):
        return f'<Post {self.title_en}>'

class Portfolio(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title_en = db.Column(db.String(120), nullable=False)
    title_fa = db.Column(db.String(120), nullable=False)
    description_en = db.Column(db.Text, nullable=False)
    description_fa = db.Column(db.Text, nullable=False)
    image_filename = db.Column(db.String, default=None, nullable=True)
    image_url = db.Column(db.String, default=None, nullable=True)
    link = db.Column(db.String(200))

    def __repr__(self):
        return f'<Portfolio {self.title_en}>'

class Message(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(64))
    email = db.Column(db.String(120))
    message = db.Column(db.Text)
    timestamp = db.Column(db.DateTime, index=True, default=db.func.now())

    def __repr__(self):
        return f'<Message {self.name}>'
