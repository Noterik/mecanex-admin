'use strict';

/**
 * @ngdoc function
 * @name mecanexAdminApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the mecanexAdminApp
 */
angular.module('mecanexAdminApp')
  .controller('CollectionsListCtrl', ['$scope', '$uibModal', 'Collections', function($scope, $uibModal, Collections) {

    $scope.cols = [];
    $scope.colsPerSlide = 4;
    $scope.curSlide = 0;

    $scope.find = function(){
      Collections.query().then(function(collections){
        collections.items.unshift(null);
        $scope.cols = collections.items;
      });
    };

    $scope.newCollectionDialog = function(){
      $uibModal.open({
        animation: true,
        templateUrl: 'views/new-collection-dialog.html',
        controller: 'NewCollectionDialogCtrl'
      });
    };

    $scope.find();
  }]);
