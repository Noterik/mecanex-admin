'use strict';

angular.module('mecanexAdminApp').factory('Collections', ['chance', '$q', 'RandomData',
  function(chance, $q, RandomData) {

    return {
      query: function(params){
        return $q(function(resolve){
          resolve(RandomData.queryCollections(params));
        });

      }
    };
  }
]);
