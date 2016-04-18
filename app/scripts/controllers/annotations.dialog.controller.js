'use strict';

angular.module('mecanexAdminApp')
  .controller('AnnotationsDialogCtrl', function ($scope, $uibModalInstance) {

    $scope.close = function() {
      $uibModalInstance.close();
    };

  });
