'use strict';

angular.module('mecanexAdminApp').factory('SpringfieldResource', ['Fsxml', '$resource',
  function(Fsxml, $resource) {
    return function(){
      return{
        create: function(url){
          return $resource(url, {
            id: '@_id'
          }, {
            save:{
              method: 'POST',
              transformRequest: function(data){
                var fsxml = new Fsxml();
                return fsxml.renderFromResource(data);
              },
              headers: {
                'Accept': 'text/xml',
                'Content-Type': 'text/xml;charset=utf-8'
              }
            },
            update:{
              method: 'PUT',
              url: url + '/properties',
              transformRequest: function(data){
                var fsxml = new Fsxml();
                return fsxml.renderFromResource(data);
              },
              headers: {
                'Accept': 'text/xml',
                'Content-Type': 'text/xml;charset=utf-8'
              }
            },
            retrieve: {
              method: 'GET',
              transformResponse: function(data) {
                var fsxml = new Fsxml();
                return fsxml.parseFromFsxml(data);
              },
              headers: {
                'Accept': 'text/xml',
                'Content-Type': 'text/xml;charset=utf-8'
              }
            }
          });
        }
      };
    };
  }
]);
