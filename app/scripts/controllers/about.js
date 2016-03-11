'use strict';

/**
 * @ngdoc function
 * @name mecanexAdminApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the mecanexAdminApp
 */
angular.module('mecanexAdminApp')
  .controller('AboutCtrl', ['Users', function (Users) {
    var user = new Users({
      id: '123',
      firstName: 'david',
      lastName: 'ammeraal'
    });
    user.$update({id: user.id});
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  }]);
