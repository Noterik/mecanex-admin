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
        img: 'images/collections/landscape.jpg'
      },{
        name: 'People',
        amountVideos: '25',
        img: 'images/collections/people.jpg'
      },{
        name: 'Art',
        amountVideos: '5',
        img: 'images/collections/art.jpg'
      }
    ];

  }]);
