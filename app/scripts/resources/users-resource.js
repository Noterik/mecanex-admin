'use strict';

angular.module('mecanexAdminApp').factory('Users', ['SpringfieldResource',
  function(SpringfieldResource) {
    var springfield = new SpringfieldResource();
    return springfield.create('/users/:id');
  }
]);
