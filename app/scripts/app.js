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

    $urlRouterProvider.otherwise('/login');

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
      .state('pages.collections', {
        abstract: true,
        url: '/collections',
        views: {
          '': {
            templateUrl: 'views/collections.html'
          }
        },
        authorizedRoles: [USER_ROLES.admin, USER_ROLES.user]
      })
      .state('pages.collections.default', {
        url: '',
        views: {
          '': {
            templateUrl: 'views/collections.list.html',
            controller: 'CollectionsListCtrl'
          },
          'list': {
            templateUrl: 'views/videos.list.html',
            controller: 'VideosListCtrl'
          }
        },
        data:{authorizedRoles: [USER_ROLES.admin, USER_ROLES.user]}
      })
      .state('pages.collections.list', {
        url: '/:colId',
        views: {
          '': {
            templateUrl: 'views/collections.list.html',
            controller: 'CollectionsListCtrl'
          },
          'list': {
            templateUrl: 'views/videos.list.html',
            controller: 'VideosListCtrl'
          }
        },
        data: {authorizedRoles: [USER_ROLES.admin, USER_ROLES.user]}
      });
  }])
  .run(function($rootScope, AUTH_EVENTS, AuthService, $state) {
    $rootScope.$on('$stateChangeStart', function(event, next) {
      var authorizedRoles = next.data.authorizedRoles;
      console.log(authorizedRoles);

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
      }else{
        console.log("ITS AUTHORIZED!");
      }

      /*
      if (!AuthService.isAuthorized(authorizedRoles)) {
        event.preventDefault();
        if (AuthService.isAuthenticated()) {
          // user is not allowed
          $rootScope.$broadcast(AUTH_EVENTS.notAuthorized);
        } else {
          // user is not logged in
          $rootScope.$broadcast(AUTH_EVENTS.notAuthenticated);
        }
      }
      */
    });
  });
