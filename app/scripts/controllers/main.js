'use strict';

/**
 * @ngdoc function
 * @name mecanexAdminApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the mecanexAdminApp
 */
var app = angular.module('mecanexAdminApp')
  .controller('MainCtrl', function () {
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });

app.filter('trusted', ['$sce', function ($sce) {
    return function(url) {
        return $sce.trustAsResourceUrl(url);
    };
}]);
