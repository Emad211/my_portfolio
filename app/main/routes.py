from flask import render_template, g, session, redirect, url_for, flash
from flask_babel import get_locale, _
from app.main import bp
from app.models import Portfolio, Post, Message
from app.main.forms import ContactForm
from app import db

@bp.before_request
def before_request():
    if 'language' in session:
        g.locale = session['language']
    else:
        g.locale = str(get_locale())

@bp.route('/set_language/<language>')
def set_language(language):
    session['language'] = language
    return redirect(url_for('main.index'))

@bp.route('/')
@bp.route('/index')
def index():
    portfolio_items = Portfolio.query.all()
    return render_template('index.html', portfolio_items=portfolio_items)

@bp.route('/blog')
def blog():
    posts = Post.query.order_by(Post.timestamp.desc()).all()
    return render_template('blog.html', posts=posts)

@bp.route('/post/<int:id>')
def post(id):
    post = Post.query.get_or_404(id)
    return render_template('post.html', post=post)

@bp.route('/about')
def about():
    return render_template('about.html')

@bp.route('/contact', methods=['GET', 'POST'])
def contact():
    form = ContactForm()
    if form.validate_on_submit():
        msg = Message(name=form.name.data, email=form.email.data, message=form.message.data)
        db.session.add(msg)
        db.session.commit()
        flash(_('Your message has been sent.'))
        return redirect(url_for('main.contact'))
    return render_template('contact.html', title=_('Contact'), form=form)
