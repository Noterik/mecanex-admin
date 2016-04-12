'use strict';

angular.module('mecanexAdminApp').factory('ExternalVideos', ['$q', '$fdb', 'SpringfieldResource',
  function($q, $fdb, SpringfieldResource) {

    var springfield = new SpringfieldResource();
    var db = $fdb.db('Mecanex');
    var externalVideos = db.collection('external-videos');

    function loadExternalVideos(){
      return $q(function(resolve){
        getExternalVideos().then(function(results){
          parseExternalVideos(results);
          resolve();
        });
      });
    }

    function getExternalVideos() {
        return springfield.create('http://a1.noterik.com:8081/smithers2/domain/mecanex/user/luce/video').retrieve().$promise.then(function(response) {
        return response;
      });
    }

    function parseExternalVideos(results) {
      var videos = [];

      angular.forEach(results.fsxml.video, function (val) {
        videos.push({
          _id: val._id,
          name: val.properties.TitleSet_TitleSetInEnglish_title,
          description: val.properties.summaryInEnglish,
          img: val.properties.screenshot,
          refer: val._referid,
          colId: -1
        });
      });
      console.log(videos.length);
      externalVideos.insert(videos);
    }

    var loadedExternalVideos = loadExternalVideos();

    return {
      query: function(params){
        params = params ? params : {};
        var query = params.query ? params.query : {};
        var settings = params.settings ? params.settings : {
          page: 0,
          limit: 10
        };

        var deferred = $q.defer();

        loadedExternalVideos.then(function(){
          var results = externalVideos.find(query, {$skip:settings.page - 1, $limit:settings.limit});
          console.log(results.$cursor.records);
          deferred.resolve({
            totalItems: results.$cursor.records,
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
