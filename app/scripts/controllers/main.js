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
      deviceNames = [
        'office',
        'Living_Room_Thermostat',
        'bedroom'
      ],
      getCurrentTemperature = function (deviceName) {
        return temperatureService.getCurrentTemperature(deviceName)
          .then(function (val) {
            self.temperatures[deviceName] = val;
            return self.temperatures[deviceName];
          }, function (err) {
            console.error('Failed to retreive temperature: ', err);
          });
      },
      getAllCurrentTemperatures = function (names) {
        names.forEach(function (curDeviceName) {
          getCurrentTemperature(curDeviceName);
        });
      },
      socket = io.connect('http://localhost:3000');
    self.temperatures = {};

//    self.temperatures.Living_Room_Thermostat = {};
//    self.temperatures.office = {};
//    self.temperatures.bedroom = {};

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

    getAllCurrentTemperatures(deviceNames);

//    temperatureService.getCurrentTemperature('office')
//      .then(function (val) {
//        self.temperatures.office = val;
//      }, function (err) {
//        console.error('err:', err);
//      });
//
//    temperatureService.getCurrentTemperature('Living_Room_Thermostat')
//      .then(function (val) {
//        self.temperatures.Living_Room_Thermostat = val;
//      }, function (err) {
//        console.error('err:', err);
//      });
//
//    temperatureService.getCurrentTemperature('Living_Room_Thermostat')
//      .then(function (val) {
//        self.temperatures.Living_Room_Thermostat = val;
//      }, function (err) {
//        console.error('err:', err);
//      });

    //periodically update the moment timeString
    $interval(function () {
      Object.keys(self.temperatures).forEach(function (curKey) {
        var m = moment(self.temperatures[curKey].timeStamp);
        self.temperatures[curKey].timeString = m.fromNow();
      });
    }, 30000);

  });
