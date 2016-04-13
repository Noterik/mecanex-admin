'use strict';

angular.module('mecanexAdminApp').filter('reverse',function() {
  return function(items) {
    return items.slice().reverse();
  };
});
