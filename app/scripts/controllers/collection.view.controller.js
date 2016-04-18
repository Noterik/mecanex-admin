'use strict';

angular.module('mecanexAdminApp')
  .controller('CollectionViewCtrl', ['$scope', '$q', '$uibModal', '$state', '$stateParams', 'CollectionVideos', 'VIDEO_CATEGORIES', '_', 'SpringfieldResource', 'Session',
   function($scope, $q, $uibModal, $state, $stateParams, CollectionVideos, VIDEO_CATEGORIES, _, SpringfieldResource, Session) {
    var springfield = new SpringfieldResource();
    $scope.items = [];

    $scope.totalItems = 0;
    $scope.currentPage = 1;
    $scope.limit = 10;
    $scope.maxPages = 5;
    $scope.formOpen = false;
    $scope.selectedVideoId = null;
    $scope.smithersUser = Session.get('smithersId');

    $scope.categories = _.values(VIDEO_CATEGORIES);
    $scope.popOverVideo = null;

    $scope.setPopoverVideo = function(video){
      $scope.popOverVideo = video;
    };

    $scope.toggleCategory = function(video, category){
      var categoryString = "";
      var present = false;

      angular.forEach(video.categories, function (value, key) {
        if (value.icon === category.icon) {
          //already there
          present = true;
        } else {
          categoryString += categoryString === "" ? video.categories[key].icon : ","+video.categories[key].icon;
        }
      });

      if (!present) {
        categoryString += ","+category.icon;

        springfield.create(video.refer+"/properties/categories", 'bart', 1).update(categoryString).$promise.then(function() {
          video.categories.push(category);
        });
      }
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

    $scope.removeCategory = function(video, category) {
      var categoryString = "";
      var deleteObject = -1;

      angular.forEach(video.categories, function (value, key) {
        if (value.icon === category) {
          deleteObject = key;
        } else {
          categoryString += categoryString === "" ? video.categories[key].icon : ","+video.categories[key].icon;
        }
      });
      //unset after loop, otherwise loop will not go correctly
      video.categories.splice(deleteObject,1);

      if (categoryString !== "") {
        springfield.create(video.refer+"/properties/categories", 'bart', 1).update(categoryString);
      } else {  //empty property, delete node
        springfield.create(video.refer+"/properties/categories", 'bart', 1).delete();
      }
    };

    $scope.handleStep = function(video, step) {
      if (step.icon === "annotation") {
        if (step.processed) {
          $scope.annotationsUrl = 'http://mecanex.noterik.com/annotations/'+step.file;

          $uibModal.open({
            animation: true,
            templateUrl: 'views/annotations-dialog.html',
            controller: 'AnnotationsDialogCtrl',
            scope: $scope,
            windowClass: 'app-modal-window',
            size: 'lg'
          });
        }
      }
      if (step.icon === "enrichment") {
        if (step.processed) {
          $state.go('pages.content-enrichments', {colId: $stateParams.colId, vidId: video._id.substr(video._id.lastIndexOf("/")+1)});
        }
      }
      if (step.icon === "editorial") {
        if (step.processed) {
          $state.go('pages.editorial-tool', {colId: $stateParams.colId, vidId: video._id.substr(video._id.lastIndexOf("/")+1)});
        }
      }
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

    function triggerProcessing() {
      console.log("triggering processing");
      springfield.create("http://mecanex.noterik.com/api/mdbprocess/domain/mecanex/user/"+$scope.smithersUser+"/collection/"+$stateParams.colId+"/video").retrieve();
    }

    $scope.pageChanged = function() {
      $scope.setPage($scope.currentPage);
    };

    $scope.setPage(1);

    triggerProcessing();
  }]);
