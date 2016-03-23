'use strict';

angular.module('mecanexAdminApp').factory('chance', ['$window', function($window){
  return new $window.Chance();
}]);
