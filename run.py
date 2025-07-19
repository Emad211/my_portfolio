from app import create_app, db
from app.models import User, Post, Portfolio, Message
import click

app = create_app()

@app.shell_context_processor
def make_shell_context():
    return {'db': db, 'User': User, 'Post': Post, 'Portfolio': Portfolio, 'Message': Message}

@app.cli.command("create-admin")
@click.argument("username")
@click.argument("password")
def create_admin(username, password):
    """Create a new admin user."""
    user = User(username=username)
    user.set_password(password)
    db.session.add(user)
    db.session.commit()
    print(f"Admin user {username} created.")
