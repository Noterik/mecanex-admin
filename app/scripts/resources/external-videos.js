'use strict';

angular.module('mecanexAdminApp').factory('ExternalVideos', ['chance', '$q', 'RandomData',
  function(chance, $q, RandomData) {

    return {
      query: function(params){
        return $q(function(resolve){
          resolve(RandomData.queryExternalVideos(params));
        });

      }
    };
  }
]);
