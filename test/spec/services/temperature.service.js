'use strict';

describe('Service: temperature.service', function () {

  // load the service's module
  beforeEach(module('temperatureDashboardApp'));

  // instantiate service
  var temperature.service;
  beforeEach(inject(function (_temperature.service_) {
    temperature.service = _temperature.service_;
  }));

  it('should do something', function () {
    expect(!!temperature.service).toBe(true);
  });

});
