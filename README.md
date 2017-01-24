# flask-socketio-practice (A.K.A Yet Another Chat Room)

Messing around with Flask-SocketIO for some real-time goodness.

Inspired by [@miguelgrinberg](https://github.com/miguelgrinberg)'s [Flask-SocketIO-Chat](https://github.com/miguelgrinberg/Flask-SocketIO-Chat) project (particularly in project format, which I think Miguel is ace at).

I'm also taking the opportunity to get more comfortable with things like CSS vars, Flexbox layouts and probably a few different front-end technologies.

### Running it

1. `git clone` and `cd` in there
2. `virtualenv venv` to set up a virtualenv (`pip install virtualenv` if you don't already have it)
3. `. venv/bin/activate`
4. `pip install -r requirements.txt`
4. `python run.py`
5. Head to [localhost:5000](localhost:5000) in your browser(s) of choice

### Various Frontends

All front-ends at the moment make use of [socket.io](http://socket.io) for nicer front-end sockets.

1. Vanilla JS powered chat-room runs at `/sockets`
2. Angular 1-powered chat-room runs at `/sockets-ng`
3. TODO: React
4. TODO: Vue2
5. TODO: Angular 2

Tested on Python 2.7.13, no reason why it wouldn't also work on other versions.
