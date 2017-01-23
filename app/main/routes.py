from flask import session, redirect, url_for, render_template, request
from . import main
from .forms import LoginForm


@main.route('/', methods=['GET', 'POST'])
def index():
    form = LoginForm()
    if form.validate_on_submit():
        session['name'] = form.name.data
        return redirect(url_for('.sockets'))
    elif request.method == "GET":
        form.name.data = session.get('name', '')
    return render_template('index.html', form=form)


@main.route('/sockets')
def sockets():
    return render_template('sockets.html')
