/*global angular, d3*/

/**
 * @ngdoc directive
 * @name temperatureDashboardApp.directive:lgCurrTemperature
 * @description
 * # lgCurrTemperature
 */
angular.module('temperatureDashboardApp')
  .directive('lgCurrTemperature', function () {
    'use strict';
    return {
      templateUrl: 'scripts/directives/lg-curr-temperature.html',
      restrict: 'E',
      scope: {
        temperature: '=',
        label: "@"
      },
      link: function postLink(scope, element, attrs) {
        var margin = {top: 20, right: 10, bottom: 20, left: 10},
          frame = {width: 70, height: 200},
          bgColor = '#e2e2e2',
          fgColor = '#3476d0',
          width = frame.width - margin.left,
          //width = frame.width - margin.left - margin.right,
          height = frame.height,
          //height = frame.height  - margin.top - margin.bottom,
          yScale = d3.scaleLinear()
            .domain([0, 120])
            .range([0, height]),
          temperatureValues = [],
          svg,
          bgRect,
          group;

        svg = d3.select(element.find('.temperature-gauge')[0])
          .append('svg')
          .attr('width', frame.width)
          .attr('height', frame.height);

        group = svg.append('g')
          .attr('transform', 'translate(' +
                margin.left + ', 0)');

        bgRect = group.append('rect')
          .attr('x', '0')
          .attr('y', '0')
          .attr('width', width)
          .attr('height', height)
          .attr('fill', bgColor);

        function render(data) {
          var gaugeSelection = group.selectAll('.temperature-gauge'),
            textSelection = group.selectAll('.temperature-text');

          gaugeSelection
            .data(data)
            .enter()
            .append('rect')
            .attr('class', 'temperature-gauge')
            .attr('x', '0')
            .attr('width', width)
            .attr('fill', fgColor)
            .merge(gaugeSelection)
            .attr('y', function (d) {
              return height - yScale(d.temperature);
            })
            .attr("height", function (d) {
              return yScale(d.temperature);
            });

          textSelection
            .data(data)
            .enter()
            .append('text')
            .attr('class', 'temperature-text')
            .attr('text-anchor', 'middle')
            .attr('x', function () {
              return width / 2;
            })
            .attr('y', function () {
              return height - 50;
            })
            .merge(textSelection)
            .text(function (d) {
              return Math.round(d.temperature) + '°';
            });
        }

        scope.$watch('temperature', function (newVals, oldVals) {
          if (newVals && newVals.temperature) {
            render([newVals]);
          }
        }, true);
      }
    };
  });
