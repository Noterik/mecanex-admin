'use strict';

angular.module('mecanexAdminApp').factory('Collections', ['chance', '$q', '$fdb', 'SpringfieldResource', '_', '$rootScope',
  function(chance, $q, $fdb, SpringfieldResource, _, $rootScope) {

    var springfield = new SpringfieldResource();

    function getCollections() {
      return springfield.create('http://a1.noterik.com:8081/smithers2/domain/mecanex/user/pieter/collection').retrieve().$promise.then(function(response) {
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
            img: 'https://unsplash.it/320/180/?random&i=' + chance.integer({min: 10, max: 20}),
            colId: colId
          });
        });
      } else {
        videos.push({
          _id: v._id,
          name: v.properties.TitleSet_TitleSetInEnglish_title,
          description: v.properties.summaryInEnglish,
          img: 'https://unsplash.it/320/180/?random&i=' + chance.integer({min: 10, max: 20}),
          colId: colId
        });
      }
      return videos;
    }

    function parseCollections() {
      var restructuredCollections = [];
      var allVideos = [];

      return getCollections().then(function(xml) {
        collections = db.collection('collections');
        collectionVideos = db.collection('collection-videos');

        angular.forEach(xml.fsxml.collection, function(val) {
          var videos = getVideos(val.video, val._id);

          restructuredCollections.push({
            collection: {
              _id: val._id,
              name: val.properties.title,
              description: val.properties.description,
              amountVideos: videos.length,
              img: 'https://unsplash.it/320/180/?random&i=' + chance.integer({min: 10, max: 20})
            },
            videos: videos
          });
        });
      }).then(function() {
        collections.insert(_.map(restructuredCollections, function(obj){
          return obj.collection;
        }));
      }).then(function() {
        var mappedVideos = _.map(restructuredCollections, function(obj){
          return obj.videos;
        });
        for(var i = 0; i < mappedVideos.length; i++){
          allVideos = allVideos.concat(mappedVideos[i]);
        }
        collectionVideos.insert(allVideos);
        console.log(collectionVideos);
        $rootScope.collectionVideos = "loaded";
      });
    }

    var db = $fdb.db('Mecanex');

    var collections;
    var collectionVideos;
    $rootScope.collectionVideos;

    return {
      query: function(params) {
        params = params ? params : {};
        var query = params.query ? params.query : {};
        var settings = params.settings ? params.settings : {
          page: 0,
          limit: 10
        };

        var deferred = $q.defer();

        if (collections !== undefined) {
          var results = collections.find(query, {$skip:settings.page, $limit:settings.limit});

          deferred.resolve({
            totalItems: results.$cursor.records,
            itemsPerPage: settings.limit,
            page: settings.page,
            items: results
          });
        } else {
          parseCollections().then(function() {
            var results = collections.find(query, {$skip:settings.page, $limit:settings.limit});
            console.log(results);
            deferred.resolve({
              totalItems: results.$cursor.records,
              itemsPerPage: settings.limit,
              page: settings.page,
              items: results
            });
          });
        }
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

        if ($rootScope.collectionVideos !== undefined) {
          var results = collectionVideos.find(query, {$page:settings.page - 1, $limit:settings.limit});

          deferred.resolve({
            totalItems: results.$cursor.records,
            itemsPerPage: settings.limit,
            page: settings.page,
            items: results
          });
        } else {
          console.log("Collection videos not yet loaded, watching untill loaded");
          var stopWatching = $rootScope.$watch("collectionVideos", function(n, o) {
            if (n === o) { return; }

            var results = collectionVideos.find(query, {$page:settings.page - 1, $limit:settings.limit});

            deferred.resolve({
              totalItems: results.$cursor.records,
              itemsPerPage: settings.limit,
              page: settings.page,
              items: results
            });
            stopWatching();
          });
        }
        return deferred.promise;
      }
    };
  }
]);
