'use strict';

angular.module('mecanexAdminApp')
  .controller('LoginController', function($scope, $rootScope, AUTH_EVENTS, AuthService, $state) {
    $scope.loginFailed = false;
    $scope.credentials = {
      username: '',
      password: ''
    };

    $scope.login = function(credentials, state) {
      AuthService.login(credentials).then(function(user) {
        $scope.loginFailed = false;
        $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
        $scope.setCurrentUser(user);
        $state.go(state);
      }, function() {
        $scope.loginFailed = true;
        $rootScope.$broadcast(AUTH_EVENTS.loginFailed);
      });
    };
  });
