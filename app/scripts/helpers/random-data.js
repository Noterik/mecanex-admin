'use strict';

angular.module('mecanexAdminApp').factory('RandomData', ['chance', '$q', '$fdb', '_', 'INGEST_STEPS', 'VIDEO_CATEGORIES',
  function(chance, $q, $fdb, _, INGEST_STEPS, VIDEO_CATEGORIES) {

    var amountCols = chance.integer({min: 20, max: 50});
    var amountExternalVideos = chance.integer({min: 50, max: 150});
    var db = $fdb.db('Mecanex');
    var collections = db.collection('random-collections');
    var collectionVideos = db.collection('random-collection-videos');
    var externalVideos = db.collection('external-videos');

    var steps = _.values(INGEST_STEPS);
    var categories = _.values(VIDEO_CATEGORIES);

    function randomCollectionVideo(possibleCategories){
      return function(){
        return {
          _id: chance.guid(),
          name: chance.sentence({words: chance.integer({min: 1, max: 5})}),
          description: chance.sentence({words: chance.integer({min: 30, max: 100})}),
          img: 'https://unsplash.it/320/180/?random&i=' + chance.integer({min: 10, max: 20}),
          categories: chance.pickset(possibleCategories, chance.integer({min: 1, max: possibleCategories.length})),
          steps: steps.slice(0, chance.integer({min: 0, max: steps.length}))
        };
      };
    }

    function randomCollection(){
      var videoLimit = chance.integer({min: 50, max: 150});
      var categoryLimit = chance.integer({min: 1, max: 5});
      var availableCategories = chance.pickset(categories, categoryLimit);

      var videos = chance.n(randomCollectionVideo(availableCategories), videoLimit);
      var id = chance.guid();

      videos = _.map(videos, function(video){
        video.colId = id;
        return video;
      });

      var colCategories = _.union.apply({}, _.map(videos, function(video){
        return _.map(video.categories, function(cat){
          return cat.name;
        });
      }));

      return {
        collection: {
          _id: id,
          name: chance.sentence({words: chance.integer({min: 1, max: 5})}),
          img: 'https://unsplash.it/320/180/?random&i=' + chance.integer({min: 10, max: 20}),
          description: chance.paragraph(),
          amountVideos: videos.length,
          categories: colCategories,
          created: new Date()
        },
        videos: videos
      };
    }

    function randomExternalVideo(){
        return {
          name: chance.sentence({words: chance.integer({min: 1, max: 5})}),
          description: chance.sentence({words: chance.integer({min: 30, max: 100})}),
          img: 'https://unsplash.it/320/180/?random&i=' + chance.integer({min: 10, max: 20})
        };
    }

    var randomCollections = chance.n(randomCollection, amountCols);
    var randomExternalVideos = chance.n(randomExternalVideo, amountExternalVideos);

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
    //externalVideos.insert(randomExternalVideos);

    return {
      queryCollections: function(params){
        params = params ? params : {};
        var query = params.query ? params.query : {};
        var settings = params.settings ? params.settings : {
          page: 1,
          limit: 10
        };

        var results = collections.find(query, {$page:settings.page - 1, $limit:settings.limit, $orderBy: {created: -1}});
        return {
          totalItems: results.$cursor.records ? results.$cursor.records : results.length,
          itemsPerPage: settings.limit,
          page: settings.page,
          items: results
        };
      },
      queryCollectionVideos: function(params){
        params = params ? params : {};
        var query = params.query ? params.query : {};
        var settings = params.settings ? params.settings : {
          page: 1,
          limit: 10
        };
        var results = collectionVideos.find(query, {$page:settings.page - 1, $limit:settings.limit});
        return {
          totalItems: results.$cursor.records ? results.$cursor.records : results.length,
          itemsPerPage: settings.limit,
          page: settings.page,
          items: results
        };
      },
      queryExternalVideos: function(params){
        params = params ? params : {};
        var query = params.query ? params.query : {};
        var settings = params.settings ? params.settings : {
          page: 1,
          limit: 10
        };
        var results = externalVideos.find(query, {$page:settings.page - 1, $limit:settings.limit});
        return {
          totalItems: results.$cursor.records ? results.$cursor.records : results.length,
          itemsPerPage: settings.limit,
          page: settings.page,
          items: results
        };
      }
    };
  }
]);
