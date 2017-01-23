from flask import session
from flask_socketio import emit, send, join_room, leave_room
import json
from collections import defaultdict
from .. import socketio

msgs = defaultdict(list)


@socketio.on('connected')
def handle_connection(received):
    name = session.get('name')
    room = session.get('room')
    print('received json from {}: {}'.format(name, str(received)))
    join_room(room)
    emit('notification', '{} connected'.format(name), room=room)
    print(msgs[room])
    emit('catch-up', json.dumps(msgs[room]))


@socketio.on('msg')
def handle_msg(received):
    name = session.get('name')
    room = session.get('room')
    print('received json from {}: {}'.format(name, str(received)))
    data = {}
    data['msg'] = received
    data['name'] = name
    json_data = json.dumps(data)
    msgs[room].append(data)
    emit('msg', json_data, room=room)
