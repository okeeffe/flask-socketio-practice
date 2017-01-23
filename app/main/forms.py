from flask_wtf import Form
from wtforms import TextField, SubmitField
from wtforms.validators import DataRequired


class LoginForm(Form):
    name = TextField(
        'Name',
        description='Enter your name',
        validators=[DataRequired()]
    )
    submit = SubmitField('Enter Chatroom')
