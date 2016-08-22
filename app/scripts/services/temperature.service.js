/*global angular */
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
              if (result.data.status) {
                if (!result.data.data) {
                  return $q.reject('Invalid device');
                }

                return result.data.data;
              } else {
                return $q.reject(result.data.msg);
              }
            });
        });
    }

    return {
      getCurrentTemperature: getCurrentTemperature
    };
  });
