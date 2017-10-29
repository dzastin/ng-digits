angular.module('testCases', [
  'ng-digits'
  ]).controller('testCasesCtrl', ['$scope',
    function($scope){
      

      /**
       * test case models
       * @type {Object}
       */
      $scope.models = {};

      $scope.options = {
        default: {},
        separators: {
          decimalSeparator: ',',
          thousandsSeparator: '\'',
          decimalCount: 2,
          minValue: -5.2
        },
        minMax: {
          minValue: 0,
          maxValue: 99
        },
        strings: {
          parseToNumber: false
        },
        leading: {
          parseToNumber: false,
          allowedLeadingZeros: true,
          thousandsSeparator: '',
        }
      };

  }]);