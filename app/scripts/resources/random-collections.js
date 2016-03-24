'use strict';

angular.module('mecanexAdminApp').factory('RandomCollections', ['chance', '$q',
  function(chance, $q) {

    var data = [];

    var amount = chance.integer({min: 3, max: 12});

    function randomVideo(){
      return {
        name: chance.sentence({words: chance.integer({min: 1, max: 5})}),
        description: chance.sentence({words: chance.integer({min: 30, max: 100})}),
        img: 'http://placehold.it/320x180?text=16:9'
      };
    }

    function randomCollection(){
      var videoLimit = chance.integer({min: 50, max: 150});
      var videos = chance.n(randomVideo, videoLimit);
      return {
        name: chance.sentence({words: chance.integer({min: 1, max: 5})}),
        img: 'http://placehold.it/320x180/cc0099?text=16:9',
        description: chance.paragraph(),
        videos: videos,
        amountVideos: videos.length
      };
    }

    data = chance.n(randomCollection, amount);

    return {
      query: function(params){
        return $q(function(resolve){
          params = params ? params : {};
          var page = params.page ? params.page : 1;
          var limit = params.limit ? params.limit : amount;

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
