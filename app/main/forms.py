from flask_wtf import FlaskForm
from wtforms import StringField, SubmitField
from wtforms.validators import DataRequired


class LoginForm(FlaskForm):
    name = StringField(
        'Name',
        description='Enter your name',
        validators=[DataRequired()]
    )
    room = StringField(
        'Room',
        description='Enter your room name',
        validators=[DataRequired()]
    )
    submit = SubmitField('Enter Room')
