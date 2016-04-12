'use strict';

angular.module('mecanexAdminApp').factory('RandomCollections', ['RandomData', '$q', '$fdb', 'chance',
  function(RandomData, $q, $fdb, chance) {
    var db = $fdb.db('Mecanex');
    var collections = db.collection('random-collections');
    return {
      query: function(params) {
        return $q(function(resolve){
          resolve(RandomData.queryCollections(params));
        });
      },
      create: function(params){
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
            params._id = chance.guid();
            params.img = 'https://unsplash.it/320/180/?random&i=' + chance.integer({min: 10, max: 20});
            params.amountVideos = 0;
            params.created = new Date();
            collections.insert(params);
            resolve(params);
          }
        });
      },
      queryVideos: function(params){
        return $q(function(resolve){
          resolve(RandomData.queryCollectionVideos(params));
        });
      }
    };
  }
]);
