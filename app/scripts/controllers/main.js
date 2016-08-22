/*global angular */
/**
 * @ngdoc function
 * @name temperatureDashboardApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the temperatureDashboardApp
 */
angular.module('temperatureDashboardApp')
  .controller('MainCtrl', function (temperatureService) {
    'use strict';
    var self = this;

    self.temperatures = {};

    self.temperatures.livingRoom = {};
    self.temperatures.office = {};

    temperatureService.getCurrentTemperature('office')
      .then(function (val) {
        self.temperatures.office = val;
      }, function (err) {
        console.error('err:', err);
      });

    temperatureService.getCurrentTemperature('Living_Room_Thermostat')
      .then(function (val) {
        self.temperatures.livingRoom = val;
      }, function (err) {
        console.error('err:', err);
      });

  });
