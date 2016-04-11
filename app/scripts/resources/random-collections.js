'use strict';

angular.module('mecanexAdminApp').factory('RandomCollections', ['RandomData', '$q',
  function(RandomData, $q) {
    return {
      query: function(params) {
        return $q(function(resolve){
          resolve(RandomData.queryCollections(params));
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
