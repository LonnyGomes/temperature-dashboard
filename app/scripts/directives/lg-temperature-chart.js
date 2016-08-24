/*global angular, d3 */

/**
 * @ngdoc directive
 * @name temperatureDashboardApp.directive:lgTemperatureChart
 * @description
 * # lgTemperatureChart
 */
angular.module('temperatureDashboardApp')
  .directive('lgTemperatureChart', function ($http) {
    'use strict';
    return {
      templateUrl: 'scripts/directives/lg-temperature-chart.html',
      restrict: 'E',
      scope: {
        temperature: '=',
        label: "@"
      },
      link: function postLink(scope, element, attrs) {
        var margin = {
            top: 20,
            right: 80,
            bottom: 30,
            left: 50
          },
          frame = {
            width: 750,
            height: 500
          },
          width = frame.width - margin.left - margin.right,
          height = frame.height - margin.top - margin.bottom,
          data;

        var parseTime = d3.utcParse("%Y-%m-%dT%H:%M:%S.%LZ");

        var x = d3.scaleTime()
          .range([0, width]);

        var y = d3.scaleLinear()
          .range([height, 0]);

        var yHumidity = d3.scaleLinear()
          .range([height, 0]);

        var temperatureLine = d3.line()
          .x(function (d) {
            return x(parseTime(d.timeStamp));
          })
          .y(function (d) {
            return y(d.temperature);
          });

        var humidityLine = d3.line()
          .x(function (d) {
            return x(parseTime(d.timeStamp));
          })
          .y(function (d) {
            return yHumidity(d.humidity);
          });

        var svg = d3.select(element.find('.temperature-chart')[0]).append('svg')
          .attr('width', width + margin.left + margin.right)
          .attr('height', height + margin.top + margin.bottom)
          .append('g')
          .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

        var callback = function (result) {
          data = result;

          x.domain(d3.extent(data, function (d) {
            return parseTime(d.timeStamp);
          }));
          y.domain(d3.extent(data, function (d) {
            return d.temperature;
          }));
          yHumidity.domain(d3.extent(data, function (d) {
            return d.humidity;
          }));

          //remove any existing elements
          //eventually this should change to use smooth transitions
          svg.selectAll('g').remove();
          svg.selectAll('path').remove();

          svg.append('g')
            .attr('class', 'axis axis--x')
            .attr('transform', 'translate(0,' + height + ')')
            .call(d3.axisBottom(x));

          //draw temperature y axis
          svg.append('g')
            .attr('class', 'axis axis--y')
            .call(d3.axisLeft(y))
            .append('text')
            .attr('class', 'axis-title')
            .attr('transform', 'rotate(-90)')
            .attr('y', 6)
            .attr('dy', '.71em')
            .style('text-anchor', 'end')
            .text('Temperature (℉)');

          //plot temperature values
          svg.append('path')
            .datum(data)
            .attr('class', 'line')
            .attr('d', temperatureLine);

          //draw humidity y axis
          svg.append('g')
            .attr('class', 'axis axis--y')
            .attr('transform', 'translate(' + width + ', 0)')
            .call(d3.axisRight(yHumidity))
            .append('text')
            .attr('class', 'axis-title humidity')
            .attr('transform', 'rotate(-90)')
            .attr('y', 35)
            .style('text-anchor', 'end')
            .text('Relative Humidity (%)');

          //plot humidity values
          svg.append('path')
            .datum(data)
            .attr('class', 'line humidity')
            .attr('d', humidityLine);
        };

        scope.$watch('temperature', function (newVals, oldVals) {
          if (newVals) {
            callback.call(null, newVals);
          }
        }, true);
      }
    };
  });
