'use strict';

angular.module('mecanexAdminApp').factory('ColVideos', ['RandomData', 'chance', '$q',
  function(RandomData, chance, $q) {

    return {
      query: function(params){
        return $q(function(resolve){
          resolve(RandomData.queryCollectionVideos(params));
        });

      }
    };
  }
]);
