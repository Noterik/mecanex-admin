'use strict';

angular.module('mecanexAdminApp')
  .controller('CollectionViewCtrl', ['$scope', '$stateParams', 'CollectionVideos', 'VIDEO_CATEGORIES', '_', function($scope, $stateParams, CollectionVideos, VIDEO_CATEGORIES, _) {
    $scope.items = [];

    $scope.totalItems = 0;
    $scope.currentPage = 1;
    $scope.limit = 10;
    $scope.maxPages = 5;
    $scope.formOpen = false;

    $scope.categories = _.values(VIDEO_CATEGORIES);
    $scope.popOverVideo = null;

    $scope.setPopoverVideo = function(video){
      $scope.popOverVideo = video;
    };

    $scope.toggleCategory = function(video, category){
      console.log('VIDEO', video);
      console.log('CATEGORY' , category);
    };

    $scope.icons = _.object(_.map(_.values(VIDEO_CATEGORIES), function(cat) {
      return [cat.name, cat.icon];
    }));

    $scope.setPage = function(pageNo) {
      $scope.currentPage = pageNo;

      var query = {
        colId: $stateParams.colId
      };

      CollectionVideos.query({
        query: query,
        settings: {
          page: $scope.currentPage,
          limit: $scope.limit
        }
      }).then(function(results) {
        $scope.totalItems = results.totalItems;
        $scope.currentPage = results.page;
        $scope.items = results.items;
      });
    };

    $scope.pageChanged = function() {
      $scope.setPage($scope.currentPage);
    };

    $scope.setPage(1);
  }]);
