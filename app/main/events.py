from flask import session
from flask_socketio import emit, join_room, leave_room
from .. import socketio


@socketio.on('my event')
def handle_my_event(json):
    print('received json from {}: {}'.format(session['name'], str(json)))
