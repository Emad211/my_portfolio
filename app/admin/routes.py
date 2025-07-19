from flask import render_template, flash, redirect, url_for, request
from urllib.parse import urlparse
from flask_login import current_user, login_user, logout_user, login_required
from app import db
from app.admin import bp
from app.admin.forms import LoginForm, PostForm, PortfolioForm
from app.models import User, Post, Portfolio, Message

@bp.route('/')
@login_required
def index():
    posts = Post.query.all()
    portfolio_items = Portfolio.query.all()
    messages = Message.query.all()
    return render_template('admin/index.html', posts=posts, portfolio_items=portfolio_items, messages=messages)

@bp.route('/login', methods=['GET', 'POST'])
def login():
    if current_user.is_authenticated:
        return redirect(url_for('admin.index'))
    form = LoginForm()
    if form.validate_on_submit():
        user = User.query.filter_by(username=form.username.data).first()
        if user is None or not user.check_password(form.password.data):
            flash('Invalid username or password')
            return redirect(url_for('admin.login'))
        login_user(user, remember=form.remember_me.data)
        next_page = request.args.get('next')
        if not next_page or urlparse(next_page).netloc != '':
            next_page = url_for('admin.index')
        return redirect(next_page)
    return render_template('admin/login.html', title='Sign In', form=form)

@bp.route('/logout')
def logout():
    logout_user()
    return redirect(url_for('main.index'))

@bp.route('/post/new', methods=['GET', 'POST'])
@login_required
def new_post():
    form = PostForm()
    if form.validate_on_submit():
        post = Post(title_en=form.title_en.data, title_fa=form.title_fa.data, body_en=form.body_en.data, body_fa=form.body_fa.data)
        db.session.add(post)
        db.session.commit()
        flash('Your post has been created!')
        return redirect(url_for('admin.index'))
    return render_template('admin/create_post.html', title='New Post', form=form)

@bp.route('/post/edit/<int:id>', methods=['GET', 'POST'])
@login_required
def edit_post(id):
    post = Post.query.get_or_404(id)
    form = PostForm(obj=post)
    if form.validate_on_submit():
        post.title_en = form.title_en.data
        post.title_fa = form.title_fa.data
        post.body_en = form.body_en.data
        post.body_fa = form.body_fa.data
        db.session.commit()
        flash('Your post has been updated!')
        return redirect(url_for('admin.index'))
    return render_template('admin/create_post.html', title='Edit Post', form=form)

@bp.route('/post/delete/<int:id>', methods=['POST'])
@login_required
def delete_post(id):
    post = Post.query.get_or_404(id)
    db.session.delete(post)
    db.session.commit()
    flash('Your post has been deleted!')
    return redirect(url_for('admin.index'))

@bp.route('/portfolio/new', methods=['GET', 'POST'])
@login_required
def new_portfolio_item():
    form = PortfolioForm()
    if form.validate_on_submit():
        item = Portfolio(title_en=form.title_en.data, title_fa=form.title_fa.data, description_en=form.description_en.data, description_fa=form.description_fa.data, image_filename=form.image_filename.data, link=form.link.data)
        db.session.add(item)
        db.session.commit()
        flash('Your portfolio item has been created!')
        return redirect(url_for('admin.index'))
    return render_template('admin/create_portfolio_item.html', title='New Portfolio Item', form=form)

@bp.route('/portfolio/edit/<int:id>', methods=['GET', 'POST'])
@login_required
def edit_portfolio_item(id):
    item = Portfolio.query.get_or_404(id)
    form = PortfolioForm(obj=item)
    if form.validate_on_submit():
        item.title_en = form.title_en.data
        item.title_fa = form.title_fa.data
        item.description_en = form.description_en.data
        item.description_fa = form.description_fa.data
        item.image_filename = form.image_filename.data
        item.link = form.link.data
        db.session.commit()
        flash('Your portfolio item has been updated!')
        return redirect(url_for('admin.index'))
    return render_template('admin/create_portfolio_item.html', title='Edit Portfolio Item', form=form)

@bp.route('/portfolio/delete/<int:id>', methods=['POST'])
@login_required
def delete_portfolio_item(id):
    item = Portfolio.query.get_or_404(id)
    db.session.delete(item)
    db.session.commit()
    flash('Your portfolio item has been deleted!')
    return redirect(url_for('admin.index'))
