'use strict';

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
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
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
