'use strict';

angular.module('mecanexAdminApp').factory('ExternalVideos', ['$q', '$fdb', 'SpringfieldResource', '_', 'INGEST_STEPS', 'VIDEO_CATEGORIES',
  function($q, $fdb, SpringfieldResource, _, INGEST_STEPS, VIDEO_CATEGORIES) {

    var springfield = new SpringfieldResource();
    var db = $fdb.db('Mecanex');
    var externalVideos = db.collection('external-videos');
    var totalItems = 0;
    var reposityUrl = '/domain/mecanex/user/luce/video/';

    var steps = _.values(INGEST_STEPS);
    var categories = _.values(VIDEO_CATEGORIES);

    function loadExternalVideos(page, limit){
      return $q(function(resolve){
        getExternalVideos(page*limit,limit).then(function(results){
          var videos = parseExternalVideos(results);
          resolve(
            videos
          );
        });
      });
    }

    function getExternalVideos(start, limit) {
        return springfield.create(reposityUrl, 'bart', 1, start, limit).retrieve().$promise.then(function(response) {
        return response;
      });
    }

    function parseExternalVideos(results) {
      var videos = [];

      if (results.fsxml.properties.totalResultsAvailable !== totalItems) {
        totalItems = results.fsxml.properties.totalResultsAvailable;
      }

      angular.forEach(results.fsxml.video, function (val) {
        var videoSteps = [];
        angular.copy(steps, videoSteps);

        if (val.properties.annotationsfile !== undefined) {
          videoSteps[0].processed = true;
          videoSteps[0].file = val.properties.annotationsfile;
        }
        if (val.properties.enrichmentsfile !== undefined && val.properties.editenrichmenturl !== undefined) {
          videoSteps[1].processed = true;
          videoSteps[1].file = val.properties.enrichmentsfile;
          videoSteps[1].url = val.properties.editenrichmenturl;
        }

        videos.push({
          _id: val._id,
          name: val.properties.TitleSet_TitleSetInEnglish_title,
          description: val.properties.summaryInEnglish,
          img: val.properties.screenshot,
          refer: reposityUrl+val._id,
          categories: val.properties.categories === undefined ? [] : getCategoryObjects(val.properties.categories.split(",")),
          duration: val.properties.TechnicalInformation_itemDuration,
          steps: videoSteps,
          colId: -1
        });
      });
      return videos;
    }

    function getCategoryObjects(chosenCategories) {
      var arr = [];

      angular.forEach(chosenCategories, function (chosenCategory) {
        for (var i = 0; i < categories.length; i++) { //use native for because angular.foreach doesn't offer break support
          if (categories[i].icon === chosenCategory) {
            arr.push(categories[i]);
            break;
          }
        }
      });
      return arr;
    }

    return {
      query: function(params){
        params = params ? params : {};
        var query = params.query ? params.query : {};
        var settings = params.settings ? params.settings : {
          page: 0,
          limit: 10
        };

        var deferred = $q.defer();

        loadExternalVideos(settings.page-1, settings.limit).then(function(results){
          deferred.resolve({
            totalItems: totalItems,
            itemsPerPage: settings.limit,
            page: settings.page,
            items: results
          });
        });
        return deferred.promise;
      }
    };
  }
]);
