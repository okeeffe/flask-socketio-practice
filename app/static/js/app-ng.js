var app = angular.module('app', []);

(function() {
  // Change the Angular interpolator symbols so they do not conflict with Jinja2 moustaches
  app.config(['$interpolateProvider', function($interpolateProvider) {
    $interpolateProvider.startSymbol('{a');
    $interpolateProvider.endSymbol('a}');
  }]);

  app.controller('mainController', ['$scope', '$log', function($scope, $log) {
    /* TODO:

    - directive for focus on chat input box on page load
    - directive for scrolling the chatbox appropriately on receipt of new messages
    */

    $scope.init = function(username) {
      $scope.USERNAME = username;
    }
    $scope.messages = [];
    $scope.inputText = '';

    var SOCKET = io.connect('http://' + document.domain + ':' + location.port);

    $scope.sendMsg = function(e) {
      SOCKET.emit('msg', $scope.inputText);
      $scope.inputText = '';
    };

    $scope.keyUpInInputBox = function(e) {
      if(e.keyCode === 13) {
        $scope.sendMsg(e);
      }
    };

    $scope.leaveRoom = function(e) {
      SOCKET.emit('leave');
    };

    SOCKET.on('connect', function() {
      SOCKET.emit('connected', {data: 'I\'m connected!'});
    });

    SOCKET.on('catch-up', function(data) {
      var msgs = JSON.parse(data);
      $scope.$apply(function() {
        $scope.messages = $scope.messages.concat(msgs);
      });
    });

    SOCKET.on('notification', function(msgJson) {
      $scope.$apply(function() {
        $scope.messages = $scope.messages.concat(JSON.parse(msgJson));
      });
    });

    SOCKET.on('msg', function(msgJson) {
      $scope.$apply(function() {
        $scope.messages = $scope.messages.concat(JSON.parse(msgJson));
      });
    });

    SOCKET.on('left', function() {
      window.location = 'http://' + document.domain + ':' + location.port;
    });
  }]);

  app.directive('focusOnLoad', function() {
    function link(scope, element, attrs) {
      element[0].focus();
    }

    return {
      restrict: 'A',
      link: link
    };
  });

  app.directive('scrollBottomWhen', ['$timeout', function($timeout) {
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

    function link(scope, element, attrs) {
      var userMovedScrollPosition = false;

      element.on('scroll', debounce(function() {
        // Divide offsetHeight by less to increase margin for what's considered "bottom"
        if(element[0].scrollTop + (element[0].offsetHeight / 5) >= (element[0].scrollHeight - element[0].offsetHeight)) {
          userMovedScrollPosition = false;
        } else {
          userMovedScrollPosition = true;
        }
      }, 250));

      // Set to watch $scope.messages.length, and scroll to bottom if user hasn't moved scroll away from bottom
      scope.$watch(attrs.scrollBottomWhen, function() {
        if(!userMovedScrollPosition) {
          $timeout(function() {
            element[0].scrollTop = element[0].scrollHeight;
          });
        }
      });
    }

    return {
      restrict: 'A',
      link: link
    };
  }]);
})();
