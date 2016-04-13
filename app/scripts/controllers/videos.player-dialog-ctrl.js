'use strict';

angular.module('mecanexAdminApp')
  .controller('PlayerDialogCtrl', function ($scope, $uibModalInstance, SpringfieldResource) {
    var springfield = new SpringfieldResource();

    $scope.playerDialogVideo = $scope.items[$scope.selectedVideoId];
    $scope.videoUri = $scope.videoUri;

    $scope.close = function() {
      $uibModalInstance.close();
    };

    $scope.add = function(videoId) {
      var url = '/domain/mecanex/user/' + $scope.smithersUser + '/collection/' + $scope.editCol + '/video';
      var attributes = {'attributes': [{'referid': videoId}]};
      springfield.create(url, 'bart').save(attributes);
    };
    $scope.delete = function(videoId) {
      var url = '/domain/mecanex/user/' + $scope.smithersUser + '/collection/' + $scope.editCol + '/video/' + videoId;
      springfield.create(url, 'bart').remove();
    };
  });
