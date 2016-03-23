'use strict';

angular.module('mecanexAdminApp').factory('RandomVideos', ['chance',
  function(chance) {

    var data = [];

    var limit = chance.integer({min: 10, max: 20});
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
        return data;
      }
    };
  }
]);
