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
    'ui.router',
    'ui.bootstrap',
    'underscore',
    'angular.filter',
    'forerunnerdb'
  ])
  .config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/collections');

    $stateProvider
      .state('collections', {
        abstract: true,
        url: '/collections',
        views: {
          '': {
            templateUrl: 'views/collections.html'
          }
        }
      })
      .state('collections.default', {
        url: '',
        views:{
          '': {
            templateUrl: 'views/collections.list.html',
            controller: 'CollectionsListCtrl'
          },
          'list': {
            templateUrl: 'views/videos.list.html',
            controller: 'VideosListCtrl'
          }
        }
      })
      .state('collections.list', {
        url: '/:colId',
        views:{
          '': {
            templateUrl: 'views/collections.list.html',
            controller: 'CollectionsListCtrl'
          },
          'list': {
            templateUrl: 'views/videos.list.html',
            controller: 'VideosListCtrl'
          }
        }
      });
  }]);
