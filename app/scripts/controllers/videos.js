'use strict';

/**
 * @ngdoc function
 * @name mecanexAdminApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the mecanexAdminApp
 */
angular.module('mecanexAdminApp')
  .controller('VideosCtrl', ['$scope', function($scope) {
    $scope.videos = [
      {
        name: 'Mountain',
        description: '',
        img: 'http://placehold.it/320x180?text=16:9'
      },{
        name: 'Tree',
        description: '',
        img: 'http://placehold.it/320x180?text=16:9'
      },{
        name: 'Panda',
        description: '',
        img: 'http://placehold.it/320x180?text=16:9'
      }
    ];

    $scope.actions = [
      {
        description: 'Add to collection',
        img: 'images/icons/add.svg'
      }
    ];
  }]);
