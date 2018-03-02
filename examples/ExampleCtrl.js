angular.module('example', [
  'ng-digits'
  ]).controller('ExampleCtrl', ['$scope',
    function($scope){
      $scope.testModel = 4567.4;
      $scope.testModel2 = 54;
      $scope.testModel4 = '34';
      $scope.testModel5 = '067';

      /**
       * float, max 2 decimal digits, 2 decimals precision
       * @type {Object}
       */
      $scope.options1 = {
        decimalSeparator: ',',
        decimalCount: 2,
        padToDecimalCount: true
      };

      /**
       * percentage value without decimals
       * @type {Object}
       */
      $scope.options2 = {
        maxValue: 100,
        minValue: 0
      };

      /**
       * min 0, max 500, as string
       * @type {Object}
       */
      $scope.options4 = {
        maxValue: 500,
        minValue: 0,
        parseToNumber: false
      };

      /**
       * min 0, max 50000, as string, allow leading zeros, 
       * @type {Object}
       */
      $scope.options5 = {
        maxValue: 50000,
        minValue: 0,
        parseToNumber: false,
        allowedLeadingZeros: true,
        thousandsSeparator: ''
      };

      $scope.type = function(model){
        return typeof model;
      }
  }]);