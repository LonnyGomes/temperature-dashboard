/*global angular */

/**
 * @ngdoc function
 * @name temperatureDashboardApp.controller:GraphsCtrl
 * @description
 * # GraphsCtrl
 * Controller of the temperatureDashboardApp
 */
angular.module('temperatureDashboardApp')
  .controller('GraphsCtrl', function (temperatureService) {
    'use strict';

    var self = this;
    self.temperatures = {
      office: null
    };

    temperatureService.getTemperature('office')
      .then(function (val) {
        self.temperatures.office = val;
      }, function (err) {
        console.error('err:', err);
      });
  });
