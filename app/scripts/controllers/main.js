/*global angular, io, moment, console */
/**
 * @ngdoc function
 * @name temperatureDashboardApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the temperatureDashboardApp
 */
angular.module('temperatureDashboardApp')
  .controller('MainCtrl', function (temperatureService, $timeout, $interval) {
    'use strict';
    var self = this,
      socket = io.connect('http://localhost:3000');
    self.temperatures = {};

    self.temperatures.livingRoom = {};
    self.temperatures.office = {};

    socket.on('connect', function () {
      console.log('got connected!');
    });

    socket.on('temperatureUpdated', function (data) {
      data.timeStamp = moment();
      data.timeString = moment().fromNow();
      $timeout(function () {
        self.temperatures[data.deviceName] = data;
      });
    });

    temperatureService.getCurrentTemperature('office')
      .then(function (val) {
        self.temperatures.office = val;
      }, function (err) {
        console.error('err:', err);
      });

    temperatureService.getCurrentTemperature('Living_Room_Thermostat')
      .then(function (val) {
        self.temperatures.Living_Room_Thermostat = val;
      }, function (err) {
        console.error('err:', err);
      });

    //periodically update the moment timeString
    $interval(function () {
      Object.keys(self.temperatures).forEach(function (curKey) {
        var m = moment(self.temperatures[curKey].timeStamp);
        self.temperatures[curKey].timeString = m.fromNow();
      });
    }, 30000);

  });
