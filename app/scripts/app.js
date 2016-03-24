'use strict';

/**
 * @ngdoc overview
 * @name mecanexAdminApp
 * @description
 * # mecanexAdminApp
 *
 * Main module of the application.
 */
angular
  .module('mecanexAdminApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'ui.bootstrap',
    'underscore',
    'angular.filter'
  ])
  .config(function ($routeProvider) {
    $routeProvider
    /*
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
      */
      .when('/', {
        templateUrl: 'views/collections.html'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl',
        controllerAs: 'about'
      })

      .otherwise({
        redirectTo: '/'
      });
  });
