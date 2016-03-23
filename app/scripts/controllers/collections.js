'use strict';

/**
 * @ngdoc function
 * @name mecanexAdminApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the mecanexAdminApp
 */
angular.module('mecanexAdminApp')
  .controller('CollectionsCtrl', ['$scope', function($scope) {
    $scope.collections = [
      {
        name: 'Landscape',
        amountVideos: '12',
        img: 'http://placehold.it/320x180/cc0099?text=16:9'
      },{
        name: 'People',
        amountVideos: '25',
        img: 'http://placehold.it/320x180/cc0099?text=16:9'
      },{
        name: 'Art',
        amountVideos: '5',
        img: 'http://placehold.it/320x180/cc0099?text=16:9'
      }
    ];

  }]);
