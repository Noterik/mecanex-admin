'use strict';

angular.module('mecanexAdminApp')
  .controller('CollectionsListCtrl', ['$scope', 'RandomCollections', 'VIDEO_CATEGORIES', '_', function($scope, Collections, VIDEO_CATEGORIES, _) {
    $scope.items = [];

    $scope.totalItems = 0;
    $scope.currentPage = 1;
    $scope.limit = 10;
    $scope.maxPages = 5;
    $scope.formOpen = false;

    $scope.newCollection = {};
    $scope.newCollectionErr = null;

    $scope.icons = _.object(_.map(_.values(VIDEO_CATEGORIES), function(cat) {
      return [cat.name, cat.icon];
    }));

    var query = {};

    $scope.toggleForm = function(){
      $scope.formOpen = !$scope.formOpen;
      if(!$scope.formOpen){
        $scope.newCollectionErr = {};
        $scope.newCollection = {};
      }
    };

    $scope.submitForm = function(){
      Collections.create($scope.newCollection).then(function(){
        $scope.newCollection = {};
        $scope.newCollectionErr = {};
        $scope.toggleForm();
        $scope.setPage(1);
      },function(err){
        $scope.newCollectionErr = err;
      });
    };

    $scope.setPage = function(pageNo) {
      $scope.currentPage = pageNo;

      Collections.query({
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

    $scope.setPage(1);
  }]);
