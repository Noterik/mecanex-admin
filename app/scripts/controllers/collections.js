'use strict';

/**
 * @ngdoc function
 * @name mecanexAdminApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the mecanexAdminApp
 */
angular.module('mecanexAdminApp')
  .controller('CollectionsCtrl', ['$scope', '$uibModal', 'RandomCollections', function($scope, $uibModal, RandomCollections) {

    $scope.cols = [];
    $scope.colsPerSlide = 4;

    $scope.find = function(){
      RandomCollections.query().then(function(collections){
        collections.items.unshift(null);
        $scope.cols = collections.items;
      });
    };

    $scope.newCollectionDialog = function(){
      $uibModal.open({
        animation: true,
        templateUrl: 'views/elements/dialogs/new-collection-dialog.html',
        controller: 'NewCollectionDialogCtrl'
      });
    };

    $scope.find();
  }]);
