'use strict';

describe('Utility: Fsxml', function(){
  var MockResource, Fsxml;

  beforeEach(module('mecanexAdminApp'));

  beforeEach(inject(function($injector, $resource){
    Fsxml = $injector.get('Fsxml');
    MockResource = $resource('/test');
  }));

  it('should create a valid fsxml from an object that is a resource', function(){
    var fsxml = new Fsxml();
    var mockObject = new MockResource({
      'name': 'jantje',
      'lastName': 'jansen'
    });

    var xml = fsxml.renderFromResource(mockObject);
    expect(xml === '<fsxml><properties><name>jantje</name><lastname>jansen</lastname></properties></fsxml>');
  });

  it('should throw an exception from an object that\'s not a resource', function(){
    var fsxml = new Fsxml();
    var mockObject = {
      'name': 'jantje',
      'lastName': 'jansen'
    };

    expect(function(){
      fsxml.renderFromResource(mockObject);
    }).toThrow(new Error('Object doesn\'t implement toJSON(), are you using a $resource?'));
  });
});
