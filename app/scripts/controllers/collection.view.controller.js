'use strict';

angular.module('mecanexAdminApp')
  .controller('CollectionViewCtrl', ['$scope', '$q', '$uibModal', '$stateParams', 'CollectionVideos', 'VIDEO_CATEGORIES', '_', 'SpringfieldResource',
   function($scope, $q, $uibModal, $stateParams, CollectionVideos, VIDEO_CATEGORIES, _, SpringfieldResource) {
    var springfield = new SpringfieldResource();
    $scope.items = [];

    $scope.totalItems = 0;
    $scope.currentPage = 1;
    $scope.limit = 10;
    $scope.maxPages = 5;
    $scope.formOpen = false;
    $scope.selectedVideoId = null;

    $scope.categories = _.values(VIDEO_CATEGORIES);
    $scope.popOverVideo = null;

    $scope.setPopoverVideo = function(video){
      $scope.popOverVideo = video;
    };

    $scope.toggleCategory = function(video, category){
      console.log('VIDEO', video);
      console.log('CATEGORY' , category);
    };

    $scope.icons = _.object(_.map(_.values(VIDEO_CATEGORIES), function(cat) {
      return [cat.name, cat.icon];
    }));

    $scope.setPage = function(pageNo) {
      $scope.currentPage = pageNo;

      var query = {
        colId: $stateParams.colId
      };

      CollectionVideos.query({
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

    $scope.playVideo = function(videoId) {
      console.log(videoId);
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

      springfield.create("http://mecanex.noterik.com/api/mdb" + videoFile).retrieve().$promise.then(function(response) {
        deferred.resolve({
          videoUri: mount + '?ticket=' + response.fsxml.properties.ticket
        });
      });
      return deferred.promise;
    }

    $scope.pageChanged = function() {
      $scope.setPage($scope.currentPage);
    };

    $scope.setPage(1);
  }]);
