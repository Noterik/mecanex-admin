'use strict';

angular.module('mecanexAdminApp').factory('Collections', ['chance', '$q', '$fdb', '$state', '$stateParams', 'SpringfieldResource', '_', 'Session', 'INGEST_STEPS', 'VIDEO_CATEGORIES',
  function(chance, $q, $fdb, $state, $stateParams, SpringfieldResource, _, Session, INGEST_STEPS, VIDEO_CATEGORIES) {
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
      var collectionsArray = results.fsxml.collection;

      if (!angular.isArray(collectionsArray)) {
        var tmpArray = [];
        tmpArray.push(collectionsArray);
        collectionsArray = tmpArray;
      }

      var settings = {
        page: 0,
        limit: 10
      };

      angular.forEach(collectionsArray, function(val) {
        var deferred = $q.defer();

        var videos = loadExternalVideos(0, 100, "", val._id).then(function(results) {
          deferred.resolve({
            totalItems: results.totalItemsAvailable,
            itemsPerPage: settings.limit,
            page: settings.page,
            items: results.videos
          });
        });

        var colvid = getVideos(val.video, val._id);

        var colCategories = _.union.apply({}, _.map(colvid, function(video){
          return _.map(video.categories, function(cat){
            return cat.name;
          });
        }));

        restructuredCollections.push({
          collection: {
            _id: val._id,
            name: val.properties.title,
            description: val.properties.description,
            amountVideos: val.video ? (!angular.isArray(val.video) ? 1 : val.video.length) : 0,
            img: val.video && val.video ? (!angular.isArray(val.video) ? val.video.properties.screenshot : val.video[0].properties.screenshot) : 'images/collections/no-thumb.png',
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

    function loadExternalVideos(page, limit, query, collId, gender, age, education){
      return $q(function(resolve){
        getExternalVideos(page*limit,limit, query, collId, gender, age, education).then(function(results){
          var videoObj = parseExternalVideos(results, collId);
          resolve(
            videoObj
          );
        });
      });
    }

    function getExternalVideos(start, limit, query, collId, gender, age, education) {
        var url = '/domain/mecanex/user/' + smithersUser + '/collection/'+ collId +"/video";
        return springfield.create(url, 'bart', 1, start, limit, query, gender, age, education).retrieve().$promise.then(function(response) {
        return response;
      });
    }

    function parseExternalVideos(results, collId) {
      var videoObj = {};
      var videos = [];
      var totalItemsAvailable = 0;

      totalItemsAvailable = results.fsxml.properties.totalResultsAvailable;

      if (totalItemsAvailable > 0) {
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
          if (val.properties.editenrichmenturl !== undefined) { //val.properties.enrichmentsfile !== undefined &&
            videoSteps[1].processed = true;
            videoSteps[1].file = '';//val.properties.enrichmentsfile;
            videoSteps[1].url = val.properties.editenrichmenturl;
          }
          if (val.properties.editorialurl !== undefined) {
            videoSteps[2].processed = true;
            videoSteps[2].url = val.properties.editorialurl;
          }

          videos.push({
            _id: '/domain/mecanex/user/' + smithersUser + '/collection/' + collId + '/video/'+ val._id,
            name: val.properties.TitleSet_TitleSetInEnglish_title,
            description: val.properties.summaryInEnglish,
            img: val.properties.screenshot,
            refer: val._referid,
            categories: val.properties.categories === undefined ? [] : getCategoryObjects(val.properties.categories.split(",")),
            duration: val.properties.TechnicalInformation_itemDuration,
            steps: videoSteps,
            colId: results.fsxml._id
          });
        });
      }
      videoObj.videos = videos;
      videoObj.totalItemsAvailable = totalItemsAvailable;

      return videoObj;
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

    function getCollections() {
      var url = '/domain/mecanex/user/' + smithersUser + '/collection';
      return springfield.create(url, 'bart', 2).retrieve().$promise.then(function(response) {
        return response;
      });
    }

    function getVideos(v, colId) {
      var videos = [];

      if (v === undefined) { return videos; }

      if (!angular.isArray(v)) {
        var tmpArray = [];
        tmpArray.push(v);
        v = tmpArray;
      }

      angular.forEach(v, function (val) {
        var videoSteps = [];
        angular.copy(steps, videoSteps);

        if (val.properties.annotationsfile !== undefined) {
          videoSteps[0].processed = true;
          videoSteps[0].file = val.properties.annotationsfile;
        }
        if (val.properties.editenrichmenturl !== undefined) { //val.properties.enrichmentsfile !== undefined &&
          videoSteps[1].processed = true;
          videoSteps[1].file = '';//val.properties.enrichmentsfile;
          videoSteps[1].url = val.properties.editenrichmenturl;
        }
        if (val.properties.editorialurl !== undefined) {
          videoSteps[2].processed = true;
          videoSteps[2].url = val.properties.editorialurl;
        }

        videos.push({
          _id: '/domain/mecanex/user/' + smithersUser + '/collection/' + colId + '/video/'+ val._id,
          name: val.properties.TitleSet_TitleSetInEnglish_title,
          description: val.properties.summaryInEnglish,
          img: val.properties.screenshot,
          refer: val._referid,
          categories: val.properties.categories === undefined ? [] : getCategoryObjects(val.properties.categories.split(",")),
          duration: val.properties.TechnicalInformation_itemDuration,
          steps: videoSteps,
          colId: colId
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
        var query = params.query ? params.query : "";
        var gender = params.gender ? params.gender : "";
        var age = params.age ? params.age : "";
        var education = params.education ? params.education : "";
        var settings = params.settings ? params.settings : {
          page: 1,
          limit: 10
        };

        var coll = $stateParams.editColId;

        if ($stateParams.colId !== undefined) {
          coll = $stateParams.colId;
        }

        var deferred = $q.defer();
        loadedCollections.then(function(){
          loadExternalVideos(settings.page-1, settings.limit, query, coll, gender, age, education).then(function(results){
            deferred.resolve({
              totalItems: results.totalItemsAvailable,
              itemsPerPage: settings.limit,
              page: settings.page,
              items: results.videos
            });
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
      addVideoToCollection: function(item, editCollection, newVideoId) {
        var clone = {};
        angular.copy(item, clone);
        clone.colId = editCollection;
        clone._id = newVideoId;

        db.collection('collections');
        collectionVideos.insert(
          clone
        );

        collections.update({
            _id: editCollection
          }, {
            $inc: {
              amountVideos: 1
            }
        });

        //update screenshot for collection if this is the first item
        var results = collections.find({
          _id: editCollection
        });
        if (results[0].amountVideos === 1) {
          collections.update({
              _id: editCollection
            }, {
              img: clone.img
          });
        }

        //update collection categories
        results = collectionVideos.find({
          colId: editCollection
        });
        var colCategories = _.union.apply({}, _.map(results, function(video){
          return _.map(video.categories, function(cat){
            return cat.name;
          });
        }));

        collections.update({
            _id: editCollection
          }, {
            categories: colCategories
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

        //update screenshot for collection if this was the last item
        var results = collections.find({
          _id: editCollection
        });
        if (results[0].amountVideos === 0) {
          collections.update({
              _id: editCollection
            }, {
              img: 'images/collections/no-thumb.png'
          });
        }

        //update collection categories
        results = collectionVideos.find({
          colId: editCollection
        });
        var colCategories = _.union.apply({}, _.map(results, function(video){
          return _.map(video.categories, function(cat){
            return cat.name;
          });
        }));

        collections.update({
            _id: editCollection
          }, {
            categories: colCategories
        });

        $state.go($state.current, {}, {reload: true, inherit: true, notify: true});
      }
    };
  }
]);
