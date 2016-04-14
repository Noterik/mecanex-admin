'use strict';

/**
 * @ngdoc function
 * @name mecanexAdminApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the mecanexAdminApp
 */
angular.module('mecanexAdminApp')
  .controller('EditorialToolCtrl',['$scope', '$stateParams', 'Session', 'SpringfieldResource',
  function($scope, $stateParams, Session, SpringfieldResource) {
    var springfield = new SpringfieldResource();
    var smithersUser = Session.get('smithersId');

    $scope.collection = $stateParams.colId;
    $scope.video = $stateParams.vidId;

    var url = "/domain/mecanex/user/"+smithersUser+"/collection/"+$scope.collection+"/video/"+$scope.video;
    springfield.create(url, 'bart', 1).retrieve().$promise.then(function(response) {
      $scope.contentenrichmenturl = response.fsxml.video.properties.editenrichment;
      console.log($scope.contentenrichmenturl);
    });
  }]);
