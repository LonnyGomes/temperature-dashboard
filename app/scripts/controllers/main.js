/*global angular, io, moment, console */
/**
 * @ngdoc function
 * @name temperatureDashboardApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the temperatureDashboardApp
 */
angular.module('temperatureDashboardApp')
  .controller('MainCtrl', function (temperatureService, $timeout, $interval, $q, $scope) {
    'use strict';
    var self = this,
      intervalPromise = null,
      visibilityEventName = null,
      deviceNames = [
        'office',
        'Living_Room_Thermostat',
        'bedroom',
        'outside',
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

        return $q.all(promises)
          .then(function (results) {
            console.log('Retrieved temperature data for all devices');
            return results;
          }, function (err) {
            console.error('Failed to retrieve all data: ' + err);
            return err;
          });
      },
      socket = io.connect('http://localhost:3000'),
      //derived from http://stackoverflow.com/a/19519701
      //this funciton adds a listener  when the screen regains focus
      listenForVisibility = (function () {
        var stateKey,
          eventKey,
          keys = {
            hidden: "visibilitychange",
            webkitHidden: "webkitvisibilitychange",
            mozHidden: "mozvisibilitychange",
            msHidden: "msvisibilitychange"
          };

        for (stateKey in keys) {
          if (keys.hasOwnProperty(stateKey)) {
            if (document[stateKey] !== undefined) {
              eventKey = keys[stateKey];
              break;
            }
          }
        }
        return function (c) {
          if (c && eventKey) {
            document.addEventListener(eventKey, c);
          }
          return eventKey;
        };
      }()),
      visibilityEventHandler = function () {
        getAllCurrentTemperatures(deviceNames);
      };

    //add visibility listeners
    visibilityEventName = listenForVisibility(visibilityEventHandler);

    self.temperatures = {};

    socket.on('connect', function () {
      console.log('got connected!');
    });

    socket.on('temperatureUpdated', function (data) {
      data.timeStamp = moment();
      data.timeString = moment().fromNow();
      //recalculate dewpont since we got new data
      data.dewpoint =
        temperatureService.calcDewPoint(data.temperature, data.humidity);

      $timeout(function () {
        self.temperatures[data.deviceName] = data;
      });
    });

    getAllCurrentTemperatures(deviceNames);

    //periodically update the moment timeString
    intervalPromise = $interval(function () {
      console.log('Updating time stamp durations');
      Object.keys(self.temperatures).forEach(function (curKey) {
        var curTemperature = self.temperatures[curKey],
          m = moment(curTemperature.timeStamp);

        curTemperature.timeString = m.fromNow();
      });
    }, 30000);

    $scope.$on("$destroy", function () {
      if (intervalPromise) {
        $interval.cancel(intervalPromise);
      }

      //remove visibility listener after leaving page
      if (visibilityEventName) {
        document.removeEventListener(visibilityEventName, visibilityEventHandler);
      }
    });

  });
