'use strict';

angular.module('mecanexAdminApp').factory('SpringfieldResource', ['Fsxml', '$resource',
  function(Fsxml, $resource) {

    var baseUrl = "http://mecanex.noterik.com/search/";
    //default values
    var start = 0;
    var limit = -1;
    var depth = 0;

    return function(){
      return{
        create: function(url, service, d, s, l, q, g, a, e) {
          if (service === 'bart') {
            depth = d === undefined ? depth : d;
            start = s === undefined ? start : s;
            limit = l === undefined ? limit : l;
            url = baseUrl + url + '?start='+start+'&limit='+limit+'&depth='+depth;

            if (q !== undefined && q !== "") {
              url += "&query="+q;
            }
            if (g !== undefined && g !== "") {
              url += "&gender="+g;
            }
            if (a !== undefined && a !== "") {
              url += "&age="+a;
            }
            if (e !== undefined && e !== "") {
              url += "&education="+e;
            }

            console.log(url);
          }
          return $resource(url, {
            id: '@_id'
          }, {
            save:{
              method: 'POST',
              transformRequest: function(data){
                var fsxml = new Fsxml();
                return fsxml.renderFromResource(data);
              },
              transformResponse: function(data) {
                var fsxml = new Fsxml();
                return fsxml.parseFromFsxml(data);
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
              transformResponse: function(data) {
                var fsxml = new Fsxml();
                return fsxml.parseFromFsxml(data);
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
            },
            remove: {
              method: 'DELETE',
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
