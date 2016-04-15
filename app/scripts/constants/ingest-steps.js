'use strict';

angular.module('mecanexAdminApp').constant('INGEST_STEPS', {
  annotation: {
    name: 'Annotations',
    icon: 'annotation',
    processed: false,
    file: ""
  },
  enrichment: {
    name: 'Content Enrichment Tool',
    icon: 'enrichment',
    processed: false,
    file: "",
    url: ""
  },
  editorial: {
    name: 'Editorial Tool',
    icon: 'editorial',
    processed: false,
    file: ""
  }
    //,
  //advertisement: 'advertisement'
});
