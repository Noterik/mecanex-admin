'use strict';

/**
 * @ngdoc function
 * @name mecanexAdminApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the mecanexAdminApp
 */
angular.module('mecanexAdminApp')
  .controller('VideosCtrl', ['$scope', 'RandomVideos', function($scope, RandomVideos) {
    $scope.videos = RandomVideos.query();

    $scope.actions = [
      {
        description: 'Add to collection',
        img: 'images/icons/add.svg'
      }
    ];
  }]);
