'use strict';

angular.module('mecanexAdminApp').factory('ColVideos', ['Collections', '$q',
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
