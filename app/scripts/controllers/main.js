/*global angular, io, moment, console */
/**
 * @ngdoc function
 * @name temperatureDashboardApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the temperatureDashboardApp
 */
angular.module('temperatureDashboardApp')
  .controller('MainCtrl', function (temperatureService, $timeout, $interval, $q) {
    'use strict';
    var self = this,
      deviceNames = [
        'office',
        'Living_Room_Thermostat',
        'bedroom',
        'attic'
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
        var promises;

        promises = names.map(function (curDeviceName) {
          return getCurrentTemperature(curDeviceName);
        });

        return $q.all(promises);
      },
      socket = io.connect('http://localhost:3000');
    self.temperatures = {};

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

    getAllCurrentTemperatures(deviceNames)
      .then(function (results) {
        console.log('Retrieved temperature data for all devices');
      }, function (err) {
        console.error('Failed to retrieve all data: ' + err);
      });

    //periodically update the moment timeString
    $interval(function () {
      Object.keys(self.temperatures).forEach(function (curKey) {
        var curTemperature = self.temperatures[curKey],
          m = moment(curTemperature.timeStamp);

        console.log('yup');
        curTemperature.timeString = m.fromNow();
        curTemperature.dewpoint =
          temperatureService.calcDewPoint(curTemperature.temperature,
            curTemperature.humidity);
      });
    }, 30000);

  });
