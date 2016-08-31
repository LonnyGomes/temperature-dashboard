/*global angular, moment */
/**
 * @ngdoc service
 * @name temperatureDashboardApp.temperature.service
 * @description
 * # temperature.service
 * Service in the temperatureDashboardApp.
 */
angular.module('temperatureDashboardApp')
  .service('temperatureService', function ($http, $q) {
    'use strict';

    function fahrenheitToCelsius(val) {
      return (val - 32) * (5 / 9);
    }

    function celsiusToFahrenheit(val) {
      return (val * (9 / 5)) + 32;
    }

    function calcDewPoint(temperature, humidity) {
      //NOTE: the formula was taken from the following URL:
      //      http://tinyurl.com/chtn2or
      // T = temperature in fahrenheit degrees
      // f = relative humidity
      // Td = dew point temperature in celsius degrees
      // TdF = dew point temperature in fahrenheit degrees
      var T = fahrenheitToCelsius(temperature),
        f = humidity,
        Td = Math.pow((f / 100), (1 / 8)) * (112 + (0.9 * T)) + (0.1 * T) - 112,
        TdF = celsiusToFahrenheit(Td);

      //return the dew point rounded to 2 significant digits
      return Math.round(celsiusToFahrenheit(Td) * 100) / 100;
    }

    function getConfig() {
      return $http.get('config.json')
        .then(function (result) {
          return result.data;
        });
    }

    // AngularJS will instantiate a singleton by calling "new" on this function
    function getCurrentTemperature(deviceName) {
      return getConfig()
        .then(function (configResult) {
          var baseUrl = configResult.temperatureBaseUrl,
            url = baseUrl + '/api/list/current/temperature/' +
                  deviceName + '?callback=JSON_CALLBACK';

          console.log('data:', configResult.temperatureBaseUrl);

          return $http.jsonp(url)
            .then(function (result) {
              var m,
                vals;

              if (result.data.status) {
                if (!result.data.data) {
                  return $q.reject('Invalid device');
                }

                vals = result.data.data;
                //add a time stamp human readable string
                m = moment(vals.timeStamp);
                vals.timeString = m.fromNow();

                //add dew point value
                vals.dewpoint = calcDewPoint(vals.temperature, vals.humidity);

                return vals;
              } else {
                return $q.reject(result.data.msg);
              }
            });
        });
    }

    function getTemperature(deviceName, dateRange) {
      return getConfig()
        .then(function (configResult) {
          var baseUrl = configResult.temperatureBaseUrl,
            url = baseUrl + '/api/list/current/temperature/' +
                  (dateRange || 'hour') + '/' +
                  deviceName + '?callback=JSON_CALLBACK';

          return $http.jsonp(url)
            .then(function (result) {
              if (result.data.status) {
                if (!result.data.data) {
                  return $q.reject('Invalid request');
                }
                return result.data.data;
              } else {
                return $q.reject(result.data.msg);
              }
            });
        });
    }

    return {
      getCurrentTemperature: getCurrentTemperature,
      getTemperature: getTemperature,
      calcDewPoint: calcDewPoint
    };
  });
