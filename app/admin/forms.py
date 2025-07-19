from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, BooleanField, SubmitField, TextAreaField
from wtforms.validators import DataRequired

class LoginForm(FlaskForm):
    username = StringField('Username', validators=[DataRequired()])
    password = PasswordField('Password', validators=[DataRequired()])
    remember_me = BooleanField('Remember Me')
    submit = SubmitField('Sign In')

class PostForm(FlaskForm):
    title_en = StringField('Title (English)', validators=[DataRequired()])
    title_fa = StringField('Title (Persian)', validators=[DataRequired()])
    body_en = TextAreaField('Body (English)', validators=[DataRequired()])
    body_fa = TextAreaField('Body (Persian)', validators=[DataRequired()])
    submit = SubmitField('Submit')

class PortfolioForm(FlaskForm):
    title_en = StringField('Title (English)', validators=[DataRequired()])
    title_fa = StringField('Title (Persian)', validators=[DataRequired()])
    description_en = TextAreaField('Description (English)', validators=[DataRequired()])
    description_fa = TextAreaField('Description (Persian)', validators=[DataRequired()])
    image_filename = StringField('Image Filename')
    link = StringField('Link')
    submit = SubmitField('Submit')
