'use strict';

/**
 * @ngdoc function
 * @name mecanexAdminApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the mecanexAdminApp
 */
angular.module('mecanexAdminApp')
  .controller('CollectionsCarouselCtrl', ['$scope', '$uibModal', '$stateParams', 'Collections', function($scope, $uibModal, $stateParams, Collections) {

    $scope.cols = [];
    $scope.colsPerSlide = 4;
    $scope.curSlide = 0;
    $scope.editCol = $stateParams.editColId;
    $scope.editTitle = "";

    $scope.find = function(){
      Collections.query().then(function(collections){
        collections.items.unshift(null);
        $scope.cols = collections.items;

        angular.forEach(collections.items, function (val) {
          if (val !== null && val._id === $scope.editCol) {
            $scope.editTitle = val.name;
          }
        });

      });
    };

    $scope.find();
  }]);
