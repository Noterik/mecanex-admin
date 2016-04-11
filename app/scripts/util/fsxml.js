'use strict';

angular.module('mecanexAdminApp').factory('Fsxml', ['X2JS',
  function(X2JS){
    return function(){

      function createDocument(){
        return (new DOMParser()).parseFromString('<fsxml><properties /></fsxml>', 'text/xml');
      }

      return {
        renderFromResource: function(object){
          var doc = createDocument();

          //Lets see if this is a simple object without functions etc.
          if(!object.toJSON){
            throw new Error('Object doesn\'t implement toJSON(), are you using a $resource?');
          }

          var propertiesNode = doc.getElementsByTagName('properties')[0];

          for(var key in object.toJSON()){
            var fieldElement = doc.createElement(key);
            fieldElement.textContent = object[key];
            propertiesNode.appendChild(fieldElement);
          }

          return doc;
        },
        parseFromFsxml: function(object) {
          var x2js = new X2JS();
          var json = x2js.xml_str2json(object);
          return json;
        }
      };
    };
  }
]);
