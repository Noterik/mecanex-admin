'use strict';

angular.module('mecanexAdminApp').factory('Collections', ['chance', '$q', '$fdb', 'SpringfieldResource', '_', 'Session',
  function(chance, $q, $fdb, SpringfieldResource, _, Session) {
    var springfield = new SpringfieldResource();
    var db = $fdb.db('Mecanex');
    var collections = db.collection('collections');
    var collectionVideos = db.collection('collection-videos');
    var smithersUser = Session.get('smithersId');

    function loadCollections(){
      return $q(function(resolve){
        getCollections().then(function(results){
          parseCollections(results);
          resolve();
        });
      });
    }

    function parseCollections(results){
      var restructuredCollections = [];
      var allVideos = [];
      angular.forEach(results.fsxml.collection, function(val) {
        var videos = getVideos(val.video, val._id);

        restructuredCollections.push({
          collection: {
            _id: val._id,
            name: val.properties.title,
            description: val.properties.description,
            amountVideos: videos.length,
            img: videos.length > 0 ? videos[0].img : 'https://unsplash.it/320/180/?random&i=' + chance.integer({min: 10, max: 20})
          },
          videos: videos
        });


      });

      collections.insert(_.map(restructuredCollections, function(obj){
        return obj.collection;
      }));

      var mappedVideos = _.map(restructuredCollections, function(obj){
        return obj.videos;
      });
      for(var i = 0; i < mappedVideos.length; i++){
        allVideos = allVideos.concat(mappedVideos[i]);
      }
      collectionVideos.insert(allVideos);
    }

    function getCollections() {
      var url = '/domain/mecanex/user/' + smithersUser + '/collection';
      return springfield.create(url, 'bart', 2).retrieve().$promise.then(function(response) {
        return response;
      });
    }

    function getVideos(v, colId) {
      var videos = [];

      if (angular.isArray(v)) {
        angular.forEach(v, function (val) {
          videos.push({
            _id: val._id,
            name: val.properties.TitleSet_TitleSetInEnglish_title,
            description: val.properties.summaryInEnglish,
            img: val.properties.screenshot,
            refer: val._referid,
            colId: colId
          });
        });
      } else {
        videos.push({
          _id: v._id,
          name: v.properties.TitleSet_TitleSetInEnglish_title,
          description: v.properties.summaryInEnglish,
          img: v.properties.screenshot,
          refer: v._referid,
          colId: colId
        });
      }
      return videos;
    }

    var loadedCollections = loadCollections();

    return {
      query: function(params) {
        params = params ? params : {};
        var query = params.query ? params.query : {};
        var settings = params.settings ? params.settings : {
          page: 0,
          limit: 10
        };

        var deferred = $q.defer();

        loadedCollections.then(function(){
          var results = collections.find(query, {$page:settings.page - 1, $limit:settings.limit});
          deferred.resolve({
            totalItems: results.$cursor.records ? results.$cursor.records : results.length,
            itemsPerPage: settings.limit,
            page: settings.page,
            items: results
          });
        });
        return deferred.promise;
      },
      queryVideos: function(params) {
        params = params ? params : {};
        var query = params.query ? params.query : {};
        var settings = params.settings ? params.settings : {
          page: 1,
          limit: 10
        };

        var deferred = $q.defer();
        loadedCollections.then(function(){
          var results = collectionVideos.find(query, {$page:settings.page - 1, $limit:settings.limit});
          deferred.resolve({
            totalItems: results.$cursor.records ? results.$cursor.records : results.length,
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
