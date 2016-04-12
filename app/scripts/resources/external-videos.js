'use strict';

angular.module('mecanexAdminApp').factory('ExternalVideos', ['$q', '$fdb', 'SpringfieldResource',
  function($q, $fdb, SpringfieldResource) {

    var springfield = new SpringfieldResource();
    var db = $fdb.db('Mecanex');
    var externalVideos = db.collection('external-videos');
    var totalItems = 0;
    var reposityUrl = '/domain/mecanex/user/luce/video/';

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
        videos.push({
          _id: val._id,
          name: val.properties.TitleSet_TitleSetInEnglish_title,
          description: val.properties.summaryInEnglish,
          img: val.properties.screenshot,
          refer: reposityUrl+val._id,
          colId: -1
        });
      });
      //externalVideos.insert(videos);
      return videos;
    }

    //var loadedExternalVideos = loadExternalVideos();

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
          //var results = externalVideos.find(query, {$skip:(settings.page - 1) * settings.limit, $limit:settings.limit});

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
