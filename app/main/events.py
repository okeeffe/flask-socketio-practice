from flask import session
from flask_socketio import emit, join_room, leave_room
import json
from .. import socketio, redis_db


@socketio.on('connected')
def handle_connection(received):
    """Sent by clients when they connect to a room.
    Broadcasts the event and sends the cached messages to the client."""
    name = session.get('name')
    room = session.get('room')
    join_room(room)

    data = {}
    data['msg'] = '{} has joined the room'.format(name)
    data['name'] = 'Server'
    json_data = json.dumps(data)

    msgs_so_far = [json.loads(msg) for msg in redis_db.lrange(room, 0, -1)]
    if msgs_so_far:
        emit('catch-up', json.dumps(msgs_so_far))
    emit('notification', json_data, room=room)


@socketio.on('msg')
def handle_msg(received):
    """Sent by the client when they send a message.
    Broadcasts the message to the room."""
    name = session.get('name')
    room = session.get('room')

    if received == 'BURN IT ALL':
        data = {}
        data['msg'] = ('All historical messages deleted for room: '
                       '{}').format(room)
        data['name'] = 'Server'
        json_data = json.dumps(data)

        redis_db.delete(room)
        emit('notification', json_data, room=room)
    else:
        data = {}
        data['msg'] = received
        data['name'] = name
        json_data = json.dumps(data)
        redis_db.rpush(room, json.dumps(data))
        redis_db.ltrim(room, 0, 99)

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
    data['name'] = 'Server'
    json_data = json.dumps(data)

    emit('notification', json_data, room=room)
    emit('left', 'You\'re outta there!')
