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
    'angular-underscore',
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
      .state('pages.view-collection', {
        url: '/collections/view/:colId',
        controller: 'CollectionViewCtrl',
        templateUrl: 'views/collection.view.html',
        data:{authorizedRoles: [USER_ROLES.admin, USER_ROLES.user]}
      })
      .state('pages.edit-collection', {
        abstract: true,
        url: '/collections/edit/:editColId',
        views: {
          '': {
            templateUrl: 'views/collections.edit.html'
          }
        },
        data:{authorizedRoles: [USER_ROLES.admin, USER_ROLES.user]}
      })
      .state('pages.edit-collection.default', {
        url: '',
        views: {
          '': {
            templateUrl: 'views/collections.edit.list.html',
            controller: 'CollectionsCarouselCtrl'
          },
          'list': {
            templateUrl: 'views/videos.list.html',
            controller: 'VideosListCtrl'
          }
        },
        params: {query: null, gender: null, age: null, education: null},
        data:{authorizedRoles: [USER_ROLES.admin, USER_ROLES.user]}
      })
      .state('pages.edit-collection.other-collection', {
        url: '/other/:colId',
        views: {
          '': {
            templateUrl: 'views/collections.edit.list.html',
            controller: 'CollectionsCarouselCtrl'
          },
          'list': {
            templateUrl: 'views/videos.list.html',
            controller: 'VideosListCtrl'
          }
        },
        params: {query: null, gender: null, age: null, education: null},
        data:{authorizedRoles: [USER_ROLES.admin, USER_ROLES.user]}
      })
      .state('pages.content-enrichments', {
        url: '/collections/:colId/video/:vidId/content-enrichments',
        views: {
          '': {
            templateUrl: 'views/content.enrichments.html',
            controller: 'ContentEnrichmentsCtrl'
          }
        },
        data:{authorizedRoles: [USER_ROLES.admin, USER_ROLES.user]}
      })
      .state('pages.editorial-tool', {
        url: '/collections/:colId/video/:vidId/editorial-tool',
        views: {
          '': {
            templateUrl: 'views/editorial.tool.html',
            controller: 'EditorialToolCtrl'
          }
        },
        data:{authorizedRoles: [USER_ROLES.admin, USER_ROLES.user]}
      })
      ;
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
