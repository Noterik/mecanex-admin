'use strict';

/**
 * @ngdoc function
 * @name mecanexAdminApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the mecanexAdminApp
 */
angular.module('mecanexAdminApp')
  .controller('CollectionsCtrl', ['$scope', 'chance', function($scope, chance) {
    $scope.cols = [
      {
        name: chance.sentence({words: chance.integer({min: 1, max: 5})}),
        amountVideos: chance.integer({min: 1, max: 50}),
        img: 'http://placehold.it/320x180/cc0099?text=16:9'
      },{
        name: chance.sentence({words: chance.integer({min: 1, max: 5})}),
        amountVideos: chance.integer({min: 1, max: 50}),
        img: 'http://placehold.it/320x180/cc0099?text=16:9'
      },{
        name: chance.sentence({words: chance.integer({min: 1, max: 5})}),
        amountVideos: chance.integer({min: 1, max: 50}),
        img: 'http://placehold.it/320x180/cc0099?text=16:9'
      }
    ];

  }]);
