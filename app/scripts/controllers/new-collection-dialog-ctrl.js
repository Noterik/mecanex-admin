'use strict';

/**
 * @ngdoc function
 * @name mecanexAdminApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the mecanexAdminApp
 */
angular.module('mecanexAdminApp')
  .controller('NewCollectionDialogCtrl', function ($scope, $uibModalInstance) {
    $scope.ok = function() {
      $uibModalInstance.close();
    };

    $scope.cancel = function() {
      $uibModalInstance.close();
    };
  });
