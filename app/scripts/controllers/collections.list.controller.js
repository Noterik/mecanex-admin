'use strict';

angular.module('mecanexAdminApp')
  .controller('CollectionsListCtrl', ['$scope', 'RandomCollections', 'VIDEO_CATEGORIES', '_', function($scope, Collections, VIDEO_CATEGORIES, _) {
    $scope.items = [];

    $scope.totalItems = 0;
    $scope.currentPage = 1;
    $scope.limit = 10;
    $scope.maxPages = 5;

    $scope.icons = _.object(_.map(_.values(VIDEO_CATEGORIES), function(cat) {
      return [cat.name, cat.icon];
    }));

    var query = {};

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

    /*
    $scope.actions = [{
      description:'Annotation',
      iconClass: 'svg-icon svg-icon-annotation'
    },{
      description: 'Enrichment',
      iconClass: 'svg-icon svg-icon-enrichment'
    },{
      description: 'Editorial',
      iconClass: 'svg-icon svg-icon-editorial'
    },{
      description: 'Advertisement',
      iconClass: 'svg-icon svg-icon-advertisement'
    }].reverse();
    */

    $scope.setPage(1);
  }]);
