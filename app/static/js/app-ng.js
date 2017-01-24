var app = angular.module('app', []);

// Change the Angular interpolator so it does not conflict with Jinja2 moustaches
app.config(['$interpolateProvider', function($interpolateProvider) {
  $interpolateProvider.startSymbol('{a');
  $interpolateProvider.endSymbol('a}');
}]);

app.controller('mainController', ['$scope', '$log', function($scope, $log) {
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

  SOCKET.on('connect', function() {
    SOCKET.emit('connected', {data: 'I\'m connected!'});
  });

  SOCKET.on('catch-up', function(data) {
    var msgs = JSON.parse(data);
    for(var i = 0; i < msgs.length; i++) {
      $scope.$apply(function() {
        $scope.messages.push(msgs[i]);
      });
    }
  });

  SOCKET.on('notification', function(msgJson) {
    $scope.$apply(function() {
      $scope.messages.push(JSON.parse(msgJson));
    });
  });

  SOCKET.on('msg', function(msgJson) {
    $scope.$apply(function() {
      $scope.messages.push(JSON.parse(msgJson));
    });
  });

  SOCKET.on('left', function() {
    window.location = 'http://' + document.domain + ':' + location.port;
  });
}]);
