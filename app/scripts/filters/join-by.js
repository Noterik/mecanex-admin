'use strict';

angular.module('mecanexAdminApp').filter('joinBy',function() {
  return function(items, delimiter) {
    return items.join(delimiter);
  };
});
