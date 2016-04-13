'use strict';

angular.module('mecanexAdminApp').factory('CollectionVideos', ['Collections', '$q',
  function(Collections, $q) {

    return {
      query: function(params){
        return $q(function(resolve){
          resolve(Collections.queryVideos(params));
        });

      }
    };
  }
]);
