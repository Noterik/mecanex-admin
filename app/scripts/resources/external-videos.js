'use strict';

angular.module('mecanexAdminApp').factory('ExternalVideos', ['$q', '$fdb', 'SpringfieldResource', '_', 'INGEST_STEPS', 'VIDEO_CATEGORIES', 'Session',
  function($q, $fdb, SpringfieldResource, _, INGEST_STEPS, VIDEO_CATEGORIES, Session) {

    var springfield = new SpringfieldResource();
    var db = $fdb.db('Mecanex');
    var externalVideos = db.collection('external-videos');
    var totalItems = 0;
    var smithersUser = Session.get('smithersId');
    var reposityUrl = '/domain/mecanex/user/luce/collection/1/video';

    if (smithersUser === "editor") {
      reposityUrl = '/domain/mecanex/user/wdr/collection/1/video';
    }

    var steps = _.values(INGEST_STEPS);
    var categories = _.values(VIDEO_CATEGORIES);

    function loadExternalVideos(page, limit, query, gender, age, education){
      return $q(function(resolve){
        getExternalVideos(page*limit,limit, query, gender, age, education).then(function(results){
          var videos = parseExternalVideos(results);
          resolve(
            videos
          );
        });
      });
    }

    function getExternalVideos(start, limit, query, gender, age, education) {
        return springfield.create(reposityUrl, 'bart', 1, start, limit, query, gender, age, education).retrieve().$promise.then(function(response) {
        return response;
      });
    }

    function parseExternalVideos(results) {
      var videos = [];

      if (results.fsxml.properties.totalResultsAvailable !== totalItems) {
        totalItems = results.fsxml.properties.totalResultsAvailable;
      }

      if (!angular.isArray(results.fsxml.video)) {
        var tmpArray = [];
        tmpArray.push(results.fsxml.video);
        results.fsxml.video = tmpArray;
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
          refer: val._referid,
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
        var query = params.query ? params.query : "";
        var settings = params.settings ? params.settings : {
          page: 0,
          limit: 10
        };
        var deferred = $q.defer();

        loadExternalVideos(settings.page-1, settings.limit, query).then(function(results){
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
