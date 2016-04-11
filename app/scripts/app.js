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
    'forerunnerdb',
    'xml'
  ])
  .config(['$stateProvider', '$urlRouterProvider', 'USER_ROLES', function($stateProvider, $urlRouterProvider, USER_ROLES) {

    $urlRouterProvider.otherwise('/collections/list');

    $stateProvider
      .state('login', {
        abstract: true,
        views: {
          '': {
            templateUrl: 'views/pages/login.html'
          }
        },
        data:{authorizedRoles: [USER_ROLES.all]}
      })
      .state('login.default', {
        url: '/login',
        views: {
          '': {
            templateUrl: 'views/login.default.html'
          }
        },
        data:{authorizedRoles: [USER_ROLES.all]}
      })
      .state('login.not-allowed', {
        url: '/not-allowed',
        templateUrl: 'views/pages/not-allowed.html',
        data:{authorizedRoles: [USER_ROLES.all]}
      })
      .state('login.logout', {
        url: '/logout',
        templateUrl: 'views/pages/logged-out.html',
        data:{authorizedRoles: [USER_ROLES.all]}
      })
      .state('pages', {
        abstract: true,
        views: {
          '': {
            templateUrl: 'views/pages/default.html'
          }
        },
        data:{authorizedRoles: [USER_ROLES.all]}
      })
      .state('pages.list-collections', {
        url: '/collections/list',
        controller: 'CollectionsListCtrl',
        templateUrl: 'views/collections.list.html',
        data:{authorizedRoles: [USER_ROLES.admin, USER_ROLES.user]}
      })
      .state('pages.add-collection', {
        abstract: true,
        url: '/collections/add',
        views: {
          '': {
            templateUrl: 'views/collections.add.html'
          }
        },
        data:{authorizedRoles: [USER_ROLES.admin, USER_ROLES.user]}
      })
      .state('pages.add-collection.default', {
        url: '',
        views: {
          '': {
            templateUrl: 'views/collections.add.list.html',
            controller: 'CollectionsCarouselCtrl'
          },
          'list': {
            templateUrl: 'views/videos.list.html',
            controller: 'VideosListCtrl'
          }
        },
        data:{authorizedRoles: [USER_ROLES.admin, USER_ROLES.user]}
      })
      .state('pages.add-collection.other-collection', {
        url: '/:colId',
        views: {
          '': {
            templateUrl: 'views/collections.add.list.html',
            controller: 'CollectionsCarouselCtrl'
          },
          'list': {
            templateUrl: 'views/videos.list.html',
            controller: 'VideosListCtrl'
          }
        },
        data:{authorizedRoles: [USER_ROLES.admin, USER_ROLES.user]}
      });
  }])
  .run(function($rootScope, AUTH_EVENTS, AuthService, $state) {
    $rootScope.$on('$stateChangeStart', function(event, next) {
      var authorizedRoles = next.data.authorizedRoles;

      if(!AuthService.isAuthorized(authorizedRoles)){
        event.preventDefault();
        if (AuthService.isAuthenticated()) {
          // user is not allowed
          $state.go('login.not-allowed');
          $rootScope.$broadcast(AUTH_EVENTS.notAuthorized);
        } else {
          $state.go('login.default');
          $rootScope.$broadcast(AUTH_EVENTS.notAuthenticated);
        }
      }
    });
  });
