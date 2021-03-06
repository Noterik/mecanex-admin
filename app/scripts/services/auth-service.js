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
    },{
      username: 'kemal@flyingeye.de',
      smithersId: 'kemal',
      password: 'kemal123',
      role: 'user'
    },{
      username: 'fokus@mecanex.eu',
      smithersId: 'fokus',
      password: 'fokus123',
      role: 'user'
    },{
      username: 'vci@mecanex.eu',
      smithersId: 'vci',
      password: 'vci123',
      role: 'user'
    },{
      username: 'luce@mecanex.eu',
      smithersId: 'luce',
      password: 'luce123',
      role: 'user'
    },{
      username: 'flyingeye@mecanex.eu',
      smithersId: 'flyingeye',
      password: 'flyingeye123',
      role: 'user'
    },{
      username: 'iccs@mecanex.eu',
      smithersId: 'iccs',
      password: 'iccs123',
      role: 'user'
    }, {
      username: 'bob@noterik.nl',
      smithersId: 'bob',
      password: 'bobbob',
      role: 'user'
    }, {
      username: 'alice@noterik.nl',
      smithersId: 'alice',
      password: 'alicealice',
      role: 'user'
    }, {
      username: 'editor@wdr-mediagroup.com',
      smithersId: 'editor',
      password: 'editorwdr',
      role: 'user'
    }

  ];

  authService.login = function (credentials) {
    var user = _.find(users, function(cUser){
      return cUser.username === credentials.username && cUser.password === credentials.password;
    });

    return $q(function(resolve, reject){
      if(user){
        var session = Session.create(chance.guid(), user.username, user.role, user.smithersId);
        resolve(session);
      }else{
        reject();
      }
    });
  };

  authService.isAuthenticated = function () {
    return !!Session.get('userId');
  };

  authService.isAuthorized = function (authorizedRoles) {
    if (!angular.isArray(authorizedRoles)) {
      authorizedRoles = [authorizedRoles];
    }

    if(authorizedRoles.indexOf('*') !== -1){
      return true;
    }else{
      if(authorizedRoles.indexOf(Session.get('userRole')) > 0){
        return true;
      }
    }
    return false;
  };

  return authService;
});
