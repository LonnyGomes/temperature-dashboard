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

    var self = this,
      getTemperature = function (deviceName, dateRange) {
        temperatureService.getTemperature(deviceName, dateRange)
          .then(function (val) {
            self.temperatures[deviceName] = val;
          }, function (err) {
            console.error('Failed to get temperature: ', err);
          });
      };

    self.temperatures = {
      office: null
    };

    self.getOfficeTemperature = function (dateRange) {
      var args = ['office'];
      if (dateRange) {
        args.push(dateRange);
      }

      getTemperature.apply(null, args);
    };

    temperatureService.getTemperature('office')
      .then(function (val) {
        self.temperatures.office = val;
      }, function (err) {
        console.error('err:', err);
      });
  });
