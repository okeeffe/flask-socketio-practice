(function() {
  var ENTER_KEYCODE = 13;
  var USERNAME = document.getElementById('username').innerHTML;
  var SOCKET = io.connect('http://' + document.domain + ':' + location.port);

  var msgsBox = document.getElementById('msgs');

  var chatBox = document.getElementById('msg-input');
  chatBox.addEventListener('keyup', function(e) {
    if(e.keyCode === ENTER_KEYCODE) {
      submitButton.click();
    }
  });

  var submitButton = document.getElementById('submit-btn');
  submitButton.addEventListener('click', function(e) {
    SOCKET.emit('msg', chatBox.value);
    chatBox.value = '';
  });

  var leaveButton = document.getElementById('leave-btn');
  leaveButton.addEventListener('click', function(e) {
    SOCKET.emit('leave');
  });

  window.onload = function(e) {
    chatBox.focus();
  };

  function createAndAppendMsg(msgJson) {
    var newMsgLi = document.createElement('li'),
        newMsgNameDiv = document.createElement('div'),
        newMsgTextDiv = document.createElement('div');

    newMsgLi.classList.add('msg');
    if(msgJson.name === 'Server') {
      newMsgLi.classList.add('server');
    }
    if(msgJson.name === USERNAME) {
      newMsgLi.classList.add('me');
    }

    newMsgNameDiv.classList.add('name');
    newMsgTextDiv.classList.add('text');

    newMsgNameDiv.innerHTML = msgJson.name;
    newMsgTextDiv.innerHTML = msgJson.msg;

    newMsgLi.append(newMsgNameDiv);
    newMsgLi.append(newMsgTextDiv);
    msgsBox.append(newMsgLi);

    // Scroll to view most recent message
    msgsBox.scrollTop = msgsBox.scrollHeight;
  }

  function handleMsg(msgJson) {
    msgJson = JSON.parse(msgJson);
    createAndAppendMsg(msgJson);
  }

  SOCKET.on('connect', function() {
    SOCKET.emit('connected', {data: 'I\'m connected!'});
  });

  SOCKET.on('catch-up', function(data) {
    var msgs = JSON.parse(data);
    for(var i = 0; i < msgs.length; i++) {
      createAndAppendMsg(msgs[i]);
    }
  });

  SOCKET.on('notification', function(msgJson) {
    handleMsg(msgJson);
  });

  SOCKET.on('msg', function(msgJson) {
    handleMsg(msgJson);
  });

  SOCKET.on('left', function() {
    window.location = 'http://' + document.domain + ':' + location.port;
  });
})();
