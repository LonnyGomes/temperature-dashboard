/*global angular, $*/

/**
 * @ngdoc overview
 * @name temperatureDashboardApp
 * @description
 * # temperatureDashboardApp
 *
 * Main module of the application.
 */
angular
  .module('temperatureDashboardApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch'
  ])
  .config(function ($routeProvider) {
    'use strict';
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main',
        resolve: {
          config: function ($http) {
            return $http.get('config.json')
              .then(function (result) {
                return result.data;
              });
          }
        }
      })
      .when('/graphs', {
        templateUrl: 'views/graphs.html',
        controller: 'GraphsCtrl',
        controllerAs: 'graphs'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
