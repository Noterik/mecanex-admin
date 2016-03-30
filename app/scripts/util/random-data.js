'use strict';

angular.module('mecanexAdminApp').factory('RandomData', ['chance', '$q', '$fdb', '_',
  function(chance, $q, $fdb, _) {

    var amountCols = chance.integer({min: 3, max: 12});
    var amountExternalVideos = chance.integer({min: 50, max: 150});

    function randomCollectionVideo(){
      return {
        _id: chance.guid(),
        name: chance.sentence({words: chance.integer({min: 1, max: 5})}),
        description: chance.sentence({words: chance.integer({min: 30, max: 100})}),
        img: 'http://placehold.it/320x180?text=16:9'
      };
    }

    function randomCollection(){
      var videoLimit = chance.integer({min: 50, max: 150});
      var videos = chance.n(randomCollectionVideo, videoLimit);
      var id = chance.guid();

      videos = _.map(videos, function(video){
        video.colId = id;
        return video;
      });

      return {
        collection: {
          _id: id,
          name: chance.sentence({words: chance.integer({min: 1, max: 5})}),
          img: 'http://placehold.it/320x180/cc0099?text=16:9',
          description: chance.paragraph(),
          amountVideos: videos.length
        },
        videos: videos
      };
    }

    function randomExternalVideo(){
        return {
          name: chance.sentence({words: chance.integer({min: 1, max: 5})}),
          description: chance.sentence({words: chance.integer({min: 30, max: 100})}),
          img: 'http://placehold.it/320x180?text=16:9'
        };
    }

    var randomCollections = chance.n(randomCollection, amountCols);
    var randomExternalVideos = chance.n(randomExternalVideo, amountExternalVideos);

    var db = $fdb
      .db('Mecanex');

    var collections = db.collection('collections');
    var collectionVideos = db.collection('collection-videos');
    var externalVideos = db.collection('external-videos');

    collections.insert(_.map(randomCollections, function(obj){
      return obj.collection;
    }));

    var allVideos = [];
    var mappedVideos = _.map(randomCollections, function(obj){
      return obj.videos;
    });
    for(var i = 0; i < mappedVideos.length; i++){
      allVideos = allVideos.concat(mappedVideos[i]);
    }
    collectionVideos.insert(allVideos);
    externalVideos.insert(randomExternalVideos);

    return {
      queryCollections: function(params){
        params = params ? params : {};
        var query = params.query ? params.query : {};
        var settings = params.settings ? params.settings : {
          page: 0,
          limit: 10
        };

        var results = collections.find(query, {$skip:settings.page, $limit:settings.limit});
        return {
          totalItems: results.$cursor.records,
          itemsPerPage: settings.limit,
          page: settings.page,
          items: results
        };
      },
      queryCollectionVideos: function(params){
        params = params ? params : {};
        var query = params.query ? params.query : {};
        var settings = params.settings ? params.settings : {
          page: 0,
          limit: 10
        };
        var results = collectionVideos.find(query, {$page:settings.page, $limit:settings.limit});

        return {
          totalItems: results.$cursor.records,
          itemsPerPage: settings.limit,
          page: settings.page,
          items: results
        };
      },
      queryExternalVideos: function(params){
        params = params ? params : {};
        var query = params.query ? params.query : {};
        var settings = params.settings ? params.settings : {
          page: 0,
          limit: 10
        };
        var results = externalVideos.find(query, {$page:settings.page, $limit:settings.limit});
        return {
          totalItems: results.$cursor.records,
          itemsPerPage: settings.limit,
          page: settings.page,
          items: results
        };
      }
    };
  }
]);
