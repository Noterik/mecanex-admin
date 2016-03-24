'use strict';

angular.module('mecanexAdminApp').factory('ExternalRandomVideos', ['chance', '$q',
  function(chance, $q) {

    var data = [];

    var limit = chance.integer({min: 50, max: 150});
    for(var i = 0; i < limit; i++){
      data.push(
        {
          name: chance.sentence({words: chance.integer({min: 1, max: 5})}),
          description: chance.sentence({words: chance.integer({min: 30, max: 100})}),
          img: 'http://placehold.it/320x180?text=16:9'
        }
      );
    }

    return {
      query: function(params){
        return $q(function(resolve){
          var page = params.page ? params.page : 1;
          var limit = params.limit ? params.limit : 5;

          var start = (page - 1) * limit;
          var end = (page) * limit;
          resolve({
            totalItems: data.length,
            itemsPerPage: limit,
            page: page,
            items: data.slice(start, end)
          });
        });

      }
    };
  }
]);
