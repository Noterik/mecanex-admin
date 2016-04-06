'use strict';

/**
 * @ngdoc function
 * @name mecanexAdminApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the mecanexAdminApp
 */
angular.module('mecanexAdminApp')
  .controller('VideosListCtrl', ['$scope', '$log', '$stateParams', 'ColVideos', 'ExternalVideos', function($scope, $log, $stateParams, ColVideos, ExternalVideos) {

    $scope.items = [];

    $scope.totalItems = 0;
    $scope.currentPage = 1;
    $scope.limit = 10;
    $scope.maxPages = 5;
    $scope.col = $stateParams.colId ? $stateParams.colId : null;

    var Videos = $scope.col ? ColVideos : ExternalVideos;
    var query = $scope.col ? {colId: $scope.col} : {};

    $scope.setPage = function(pageNo) {
      $scope.currentPage = pageNo;

      Videos.query({
        query: query,
        settings:{
          page: $scope.currentPage,
          limit: $scope.limit
        }
      }).then(function(results){
        $scope.totalItems = results.totalItems;
        $scope.currentPage = results.page;
        $scope.items = results.items;
      });
    };

    $scope.pageChanged = function() {
      $scope.setPage($scope.currentPage);
    };

    $scope.actions = [{
      description: 'Add to collection',
      icon: 'plus'
    }];

    $scope.setPage(1);
  }]);
