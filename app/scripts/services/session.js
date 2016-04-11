'use strict';

angular.module('mecanexAdminApp').service('Session', function () {
  this.create = function (sessionId, userId, userRole, smithersId) {
    this.id = sessionId;
    this.userId = userId;
    this.userRole = userRole;
    this.smithersId = smithersId;
  };
  this.destroy = function () {
    this.id = null;
    this.userId = null;
    this.userRole = null;
    this.smithersId = null;
  };
});
