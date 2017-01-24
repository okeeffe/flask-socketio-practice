from flask import session
from flask_socketio import emit, join_room, leave_room
import json
from collections import defaultdict
from .. import socketio

msgs = defaultdict(list)


@socketio.on('connected')
def handle_connection(received):
    """Sent by clients when they connect to a room.
    Broadcasts the event and sends the cached messages to the client."""
    name = session.get('name')
    room = session.get('room')
    join_room(room)

    data = {}
    data['msg'] = '{} has joined the room'.format(name)
    data['name'] = 'SERVER'
    json_data = json.dumps(data)
    msgs[room].append(data)

    emit('notification', json_data, room=room)
    emit('catch-up', json.dumps(msgs[room]))


@socketio.on('msg')
def handle_msg(received):
    """Sent by the client when they send a message.
    Broadcasts the message to the room."""
    name = session.get('name')
    room = session.get('room')
    print('received json from {}: {}'.format(name, str(received)))

    data = {}
    data['msg'] = received
    data['name'] = name
    json_data = json.dumps(data)
    msgs[room].append(data)

    emit('msg', json_data, room=room)


@socketio.on('leave')
def handle_leave():
    """Sent by the client when they leave a room.
    Tells the room and send confirmation to the client."""
    name = session.get('name')
    room = session.get('room')
    leave_room(room)

    data = {}
    data['msg'] = '{} has left the room'.format(name)
    data['name'] = 'SERVER'
    json_data = json.dumps(data)
    msgs[room].append(data)

    emit('notification', json_data, room=room)
    emit('left', 'You\'re outta there!')
