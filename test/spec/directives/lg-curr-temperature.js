'use strict';

describe('Directive: lgCurrTemperature', function () {

  // load the directive's module
  beforeEach(module('temperatureDashboardApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<lg-curr-temperature></lg-curr-temperature>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the lgCurrTemperature directive');
  }));
});
