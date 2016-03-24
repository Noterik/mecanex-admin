'use strict';

/**
 * @ngdoc function
 * @name mecanexAdminApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the mecanexAdminApp
 */
angular.module('mecanexAdminApp')
  .controller('VideosCtrl', ['$scope', '$log', 'ExternalRandomVideos', function($scope, $log, Videos) {

    $scope.items = [];

    $scope.totalItems = 0;
    $scope.currentPage = 1;
    $scope.limit = 10;
    $scope.maxPages = 5;

    $scope.setPage = function(pageNo) {
      $scope.currentPage = pageNo;

      Videos.query({
        page: $scope.currentPage,
        limit: $scope.limit
      }).then(function(results){
        $scope.totalItems = results.totalItems;
        $scope.currentPage = results.page;
        $scope.items = results.items;
      });
    };

    $scope.pageChanged = function() {
      $log.log('Page changed to: ' + $scope.currentPage);
      $scope.setPage($scope.currentPage);
    };

    $scope.actions = [{
      description: 'Add to collection',
      img: 'images/icons/add.svg'
    }];

    $scope.setPage(1);
  }]);
