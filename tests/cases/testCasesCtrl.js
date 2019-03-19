angular.module('testCases', [
  'ng-digits'
  ]).controller('testCasesCtrl', ['$scope',
    function($scope){
      

      /**
       * test case models
       * @type {Object}
       */
      $scope.models = {
        nullBug: null
      };

      $scope.options = {
        default: {},
        separators: {
          decimalSeparator: ',',
          thousandsSeparator: '\'',
          decimalCount: 2,
          minValue: -5.2
        },
        padding: {
          decimalCount: 2,
          padToDecimalCount: true
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
        },
        nullBug: {
          maxValue: 5000,
          minValue: 1000,
          decimalCount: 0
        }
      };

  }]);