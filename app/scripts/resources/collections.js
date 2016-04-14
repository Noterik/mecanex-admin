'use strict';

angular.module('mecanexAdminApp').factory('Collections', ['chance', '$q', '$fdb', '$state', 'SpringfieldResource', '_', 'Session', 'INGEST_STEPS', 'VIDEO_CATEGORIES',
  function(chance, $q, $fdb, $state, SpringfieldResource, _, Session, INGEST_STEPS, VIDEO_CATEGORIES) {
    var springfield = new SpringfieldResource();
    var db = $fdb.db('Mecanex');
    var collections = db.collection('collections');
    var collectionVideos = db.collection('collection-videos');
    var smithersUser = Session.get('smithersId');
    var loadedCollections;

    var steps = _.values(INGEST_STEPS);
    var categories = _.values(VIDEO_CATEGORIES);

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

        var colCategories = _.union.apply({}, _.map(videos, function(video){
          return _.map(video.categories, function(cat){
            return cat.name;
          });
        }));

        restructuredCollections.push({
          collection: {
            _id: val._id,
            name: val.properties.title,
            description: val.properties.description,
            amountVideos: videos.length,
            img: videos.length > 0 ? videos[0].img : 'images/collections/no-thumb.png',
            categories: colCategories,
            steps: steps.slice(0, chance.integer({min: 0, max: steps.length}))
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

      if (v === undefined) { return videos; }

      var videoLimit = chance.integer({min: 50, max: 150});
      var categoryLimit = chance.integer({min: 1, max: 5});
      var availableCategories = chance.pickset(categories, categoryLimit);

      if (angular.isArray(v)) {
        angular.forEach(v, function (val) {
          videos.push({
            _id: val._id,
            name: val.properties.TitleSet_TitleSetInEnglish_title,
            description: val.properties.summaryInEnglish,
            img: val.properties.screenshot,
            refer: val._referid,
            categories: chance.pickset(availableCategories, chance.integer({min: 1, max: availableCategories.length})),
            duration: val.properties.TechnicalInformation_itemDuration,
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
          categories: chance.pickset(availableCategories, chance.integer({min: 1, max: availableCategories.length})),
          duration: v.properties.TechnicalInformation_itemDuration,
          colId: colId
        });
      }
      return videos;
    }

    loadedCollections = loadCollections();

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
      },
      create: function(params) {
        return $q(function(resolve, reject){
          var hasError = false;
          var errors = {

          };
          if(!params.name || params.name === ''){
            hasError = true;
            errors.name = 'Name is required!';
          }

          if(!params.description || params.description === ''){
            hasError = true;
            errors.description = 'Description is required!';
          }
          if(hasError){
            reject(errors);
          }else{
            var url = '/domain/mecanex/user/' + smithersUser + '/collection';
              var properties = {'properties': [{'title': params.name}, {'description': params.description}]};
            springfield.create(url, 'bart').save(properties).$promise.then(function(response) {
              var uri = response.status.properties.uri;
              var id = uri.substring(uri.lastIndexOf("/")+1);
              collections.insert({
                _id: id,
                name: params.name,
                description: params.description,
                amountVideos: 0,
                img: 'images/collections/no-thumb.png'
              });
              $state.go($state.current, {}, {reload: true, inherit: true, notify: true});
              resolve();
            });
          }
        });
      },
      addVideoToCollection: function(item, editCollection) {
        item.colId = editCollection;
        delete item.$$hashKey;

        db.collection('collections');
        collectionVideos.insert(
          item
        );

        collections.update({
            _id: editCollection
          }, {
            $inc: {
              amountVideos: 1
            }
        });
        $state.go($state.current, {}, {reload: true, inherit: true, notify: true});
      },
      removeVideoFromCollection: function(videoId, editCollection) {
        collectionVideos.remove({
          $and: [{
              _id: videoId
          }, {
              colId: editCollection
          }]
        });

        collections.update({
            _id: editCollection
          }, {
            $inc: {
              amountVideos: -1
            }
        });
        $state.go($state.current, {}, {reload: true, inherit: true, notify: true});
      }
    };
  }
]);
