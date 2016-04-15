'use strict';

/**
 * @ngdoc function
 * @name mecanexAdminApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the mecanexAdminApp
 */
angular.module('mecanexAdminApp')
  .controller('VideosListCtrl', ['$scope', '$q', '$uibModal', '$log', '$stateParams', 'CollectionVideos', 'ExternalVideos', 'SpringfieldResource', 'Session', 'Collections',
  function($scope, $q, $uibModal, $log, $stateParams, CollectionVideos, ExternalVideos, SpringfieldResource, Session, Collections) {
    var springfield = new SpringfieldResource();
    var smithersUser = Session.get('smithersId');

    $scope.items = [];

    $scope.totalItems = 0;
    $scope.currentPage = 1;
    $scope.limit = 10;
    $scope.maxPages = 5;
    $scope.col = $stateParams.colId ? $stateParams.colId : null;
    $scope.editCol = $stateParams.editColId;
    $scope.selectedVideoId = null;
    $scope.smithersUser = smithersUser;

    var Videos = $scope.col === 'repository' ? ExternalVideos :CollectionVideos;
    var query = $scope.col ? {
      colId: $scope.col
    } : {
      colId: $scope.editCol
    };

    $scope.setPage = function(pageNo) {
      $scope.currentPage = pageNo;

      Videos.query({
        query: query,
        settings: {
          page: $scope.currentPage,
          limit: $scope.limit
        }
      }).then(function(results) {
        $scope.totalItems = results.totalItems;
        $scope.currentPage = results.page;
        $scope.items = results.items;
      });
    };

    $scope.pageChanged = function() {
      $scope.setPage($scope.currentPage);
    };

    $scope.playVideo = function(videoId) {
      $scope.selectedVideoId = videoId;

      springfield.create($scope.items[videoId].refer, 'bart', 1).retrieve().$promise.then(function(response) {
        handleVideo(response, $scope.items[videoId].refer).then(function(response) {
          $scope.videoUri = response.videoUri;
          $uibModal.open({
            animation: true,
            templateUrl: 'views/player-dialog.html',
            controller: 'PlayerDialogCtrl',
            scope: $scope,
            windowClass: 'app-modal-window',
            size: 'lg'
          });
        });
      });
    };

    $scope.actions = $stateParams.colId ? [{
      description: 'Add to collection',
      action: 'addVideo',
      icon: 'plus'
    }] : [{
      description: 'Remove from collection',
      action: 'removeVideo',
      icon: 'minus'
    }];

    $scope.setPage(1);

    $scope.addVideo = function(videoId, id) {
      var url = '/domain/mecanex/user/' + smithersUser + '/collection/' + $scope.editCol + '/video';
      var attributes = {'attributes': [{'referid': videoId}]};
      springfield.create(url, 'bart').save(attributes).$promise.then(function(){
        Collections.addVideoToCollection($scope.items[id], $scope.editCol);
      });
    };

    $scope.removeVideo = function(videoId) {
      var url = '/domain/mecanex/user/' + smithersUser + '/collection/' + $scope.editCol + '/video/' + videoId;
      springfield.create(url, 'bart').remove().$promise.then(function() {
        Collections.removeVideoFromCollection(videoId, $scope.editCol);
      });
    };

    function handleVideo(xml, videoId) {
      var mount = xml.fsxml.video.rawvideo.properties.mount;
      var rawId = xml.fsxml.video.rawvideo._id;
      var extension = xml.fsxml.video.rawvideo.properties.extension;
      if (mount.indexOf(',') >= 0) {
        mount = mount.substring(0, mount.indexOf(','));
      }
      if (mount.indexOf('http') === -1) {
        mount = 'http://' + mount + '.noterik.com/progressive/' + mount + videoId + '/rawvideo/' + rawId + '/raw.' + extension;
      }
      mount = mount.replace('mecanex', 'euscreenxl');
      mount = mount.replace('luce', 'eu_luce');

      var videoFile = mount.substring(mount.indexOf('progressive') + 11);

      var deferred = $q.defer();

      springfield.create("http://mecanex.noterik.com/api/mdbticket" + videoFile).retrieve().$promise.then(function(response) {
        deferred.resolve({
          videoUri: mount + '?ticket=' + response.fsxml.properties.ticket
        });
      });
      return deferred.promise;
    }
  }]);
