'use strict';

angular.module('mecanexAdminApp').service('Session', function ($cookies) {
  var vars = {};

  if($cookies.getObject('session')){
      vars = $cookies.getObject('session');
  }

  return {
    create: function(sessionId, userId, userRole, smithersId){
      vars.sessionId = sessionId;
      vars.userId = userId;
      vars.userRole = userRole;
      vars.smithersId = smithersId;
      $cookies.putObject('session', vars);
    },
    destroy: function(){
      vars = {};
      $cookies.remove('session');
    },
    get: function(key){
      return vars[key];
    }
  };
});
