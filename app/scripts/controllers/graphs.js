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
        return temperatureService.getTemperature(deviceName, dateRange)
          .then(function (val) {
            self.temperatures[deviceName] = val;
          }, function (err) {
            console.error('Failed to get temperature: ', err);
          });
      };

    self.temperatures = {
      office: null,
      bedroom: null,
      Living_Room_Thermostat: null
    };

    self.getOfficeTemperature = function (dateRange) {
      var args = ['office'];
      if (dateRange) {
        args.push(dateRange);
      }

      getTemperature.apply(null, args);
    };

    self.getLivingRoomTemperature = function (dateRange) {
      var args = ['Living_Room_Thermostat'];
      if (dateRange) {
        args.push(dateRange);
      }

      getTemperature.apply(null, args);
    };

    self.getBedroomTemperature = function (dateRange) {
      var args = ['bedroom'];
      if (dateRange) {
        args.push(dateRange);
      }

      getTemperature.apply(null, args);
    };

    self.getOutsideTemperature = function (dateRange) {
      var args = ['outside'];
      if (dateRange) {
        args.push(dateRange);
      }

      getTemperature.apply(null, args);
    };

    getTemperature('office');
    getTemperature('bedroom');
    getTemperature('Living_Room_Thermostat');
    getTemperature('outside');

  });
