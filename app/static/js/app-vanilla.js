(function() {
  var ENTER_KEYCODE = 13,
      USERNAME = document.getElementById('username').innerHTML,
      SOCKET = {},
      RECEIVED_CATCHUP = false,
      USERSCROLLED = false;

  var msgsBox = document.getElementById('msgs-box'),
      msgsUl = document.getElementById('msgs'),
      chatBox = document.getElementById('msg-input'),
      submitButton = document.getElementById('submit-btn'),
      leaveButton = document.getElementById('leave-btn');

  function initListeners() {
    chatBox.addEventListener('keyup', function(e) {
      if(e.keyCode === ENTER_KEYCODE) {
        submitButton.click();
      }
    });

    submitButton.addEventListener('click', function(e) {
      SOCKET.emit('msg', chatBox.value);
      chatBox.value = '';
    });

    leaveButton.addEventListener('click', function(e) {
      SOCKET.emit('leave');
    });

    msgsBox.addEventListener('scroll', handleMsgsBoxScroll());
  }

  function debounce(func, wait, immediate) {
    var timeout;
    return function() {
      var context = this,
          args = arguments;

      var later = function() {
        timeout = null;
        if (!immediate) func.apply(context, args);
      };

      var callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func.apply(context, args);
    };
  };

  function handleMsgsBoxScroll() {
    return debounce(function() {
      // Divide offsetHeight by less to increase margin for what's considered "bottom"
      if(msgsBox.scrollTop + (msgsBox.offsetHeight / 5) >= (msgsBox.scrollHeight - msgsBox.offsetHeight)) {
        USERSCROLLED = false;
      } else {
        USERSCROLLED = true;
      }
    }, 250);
  }

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
    msgsUl.append(newMsgLi);

    if(!USERSCROLLED) {
      // Scroll to view most recent message
      msgsBox.scrollTop = msgsBox.scrollHeight;
    }
  }

  function handleMsg(msgJson) {
    msgJson = JSON.parse(msgJson);
    createAndAppendMsg(msgJson);
  }

  function initSocket() {
    SOCKET = io.connect('http://' + document.domain + ':' + location.port);
    SOCKET.on('connect', function() {
      SOCKET.emit('connected', {data: 'I\'m connected!'});
    });

    SOCKET.on('catch-up', function(data) {
      if(!RECEIVED_CATCHUP) {
        var msgs = JSON.parse(data);
        for(var i = 0; i < msgs.length; i++) {
          createAndAppendMsg(msgs[i]);
        }
        RECEIVED_CATCHUP = true;
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
  }

  window.onload = function(e) {
    initSocket();
    initListeners();
    chatBox.focus();
  };
})();
