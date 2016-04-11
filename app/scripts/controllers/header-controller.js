'use strict';

angular.module('mecanexAdminApp')
  .controller('HeaderController', function($scope, Session, $log, $state) {
    $scope.currentUser = Session.userId;

    $scope.status = {
      isopen: false
    };

    $scope.toggled = function(open) {
      $log.log('Dropdown is now: ', open);
    };

    $scope.logout = function(){
      Session.destroy();
      $state.go('login.logout');
    };
  });
