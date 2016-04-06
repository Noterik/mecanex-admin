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

    $urlRouterProvider.otherwise('/login');

    $stateProvider
      .state('login', {
        abstract: true,
        views:{
          '': {
            templateUrl: 'views/pages/login.html'
          }
        }
      })
      .state('login.default', {
        url: '/login',
        views: {
          '': {
            templateUrl: 'views/login.default.html'
          }
        }
      })
      .state('pages', {
        abstract: true,
        views: {
          '': {
            templateUrl: 'views/pages/default.html'
          }
        }
      })
      .state('pages.collections', {
        abstract: true,
        url: '/collections',
        views: {
          '': {
            templateUrl: 'views/collections.html'
          }
        }
      })
      .state('pages.collections.default', {
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
      .state('pages.collections.list', {
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
