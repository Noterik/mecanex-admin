'use strict';

angular.module('mecanexAdminApp').factory('Fsxml', ['X2JS',
  function(X2JS){
    return function(){

      function createDocument(){
        return (new DOMParser()).parseFromString('<fsxml></fsxml>', 'text/xml');
      }

      return {
        renderFromResource: function(object){
          var doc = createDocument();
          var fsxml = doc.getElementsByTagName('fsxml')[0];

          if (object.properties) {
            var propertiesNode = doc.createElement("properties");
            fsxml.appendChild(propertiesNode);

            angular.forEach(object.properties, function (key) {
              angular.forEach(key, function(k, v) {
                var fieldElement = doc.createElement(v);
                fieldElement.textContent = k;
                propertiesNode.appendChild(fieldElement);
              });
            });
          } else if (object.attributes) {
            var attributesNode = doc.createElement("attributes");
            fsxml.appendChild(attributesNode);

            angular.forEach(object.attributes, function (key) {
              angular.forEach(key, function(k, v) {
                var fieldElement = doc.createElement(v);
                fieldElement.textContent = k;
                attributesNode.appendChild(fieldElement);
              });
            });
          } else {
            //single property
            doc = object;
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
