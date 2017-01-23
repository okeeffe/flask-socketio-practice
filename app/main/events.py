from flask import session
from flask_socketio import emit, join_room, leave_room
import json
from .. import socketio


@socketio.on('connected')
def handle_connection(received):
    name = session.get('name')
    room = session.get('room')
    print('received json from {}: {}'.format(name, str(received)))
    join_room(room)
    emit('notification', '{} connected'.format(name), room=room)


@socketio.on('msg')
def handle_msg(received):
    name = session.get('name')
    room = session.get('room')
    print('received json from {}: {}'.format(name, str(received)))
    data = {}
    data['msg'] = received
    data['name'] = name
    json_data = json.dumps(data)
    emit('msg', json_data, room=room)
