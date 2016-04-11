'use strict';

angular.module('mecanexAdminApp').factory('AuthService', function ($http, Session, _, chance, $q) {
  var authService = {};

  var users = [
    {
      username: 'admin@mecanex.nl',
      smithersId: 'test-admin',
      password: 'admin123',
      role: 'admin'
    },
    {
      username: 'guest@mecanex.nl',
      smithersId: 'test-guest',
      password: 'guest123',
      role: 'guest'
    },
    {
      username: 'user@mecanex.nl',
      smithersId: 'test-user',
      password: 'user123',
      role: 'user'
    },{
      username: 'pieter@noterik.nl',
      smithersId: 'pieter',
      password: 'pieter123',
      role: 'user'
    }

  ];

  authService.login = function (credentials) {
    console.log("CREDENTIALS" , credentials);
    var user = _.find(users, function(cUser){
      return cUser.username === credentials.username && cUser.password === credentials.password;
    });

    return $q(function(resolve, reject){
      if(user){
        resolve(Session.create(chance.guid(), user.username, user.role, user.smithersId));
      }else{
        reject();
      }
    });
  };

  authService.isAuthenticated = function () {
    return !!Session.userId;
  };

  authService.isAuthorized = function (authorizedRoles) {
    if (!angular.isArray(authorizedRoles)) {
      authorizedRoles = [authorizedRoles];
    }

    if(authorizedRoles.indexOf("*") !== -1){
      return true;
    }else{
      console.log(authorizedRoles.indexOf(Session.userRole));
      if(authorizedRoles.indexOf(Session.userRole) > 0){
        return true;
      }
    }
    return false;
  };

  return authService;
});
