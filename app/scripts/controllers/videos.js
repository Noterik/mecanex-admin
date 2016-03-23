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
        img: 'images/videos/mountain.jpg'
      },{
        name: 'Tree',
        description: '',
        img: 'images/videos/tree.jpg'
      },{
        name: 'Panda',
        description: '',
        img: 'images/videos/panda.jpg'
      }
    ];

  }]);
