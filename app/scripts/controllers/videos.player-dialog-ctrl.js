'use strict';

angular.module('mecanexAdminApp')
  .controller('PlayerDialogCtrl', function ($scope, $uibModalInstance) {

    $scope.playerDialogVideo = $scope.items[$scope.selectedVideoId];
    $scope.videoUri = $scope.videoUri;

    $scope.close = function() {
      $uibModalInstance.close();
    };
  });
