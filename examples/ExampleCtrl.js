angular.module('example', [
  'ng-digits'
  ]).controller('ExampleCtrl', ['$scope',
    function($scope){
      $scope.testModel = 4567.45;
      $scope.testModel2 = 54;
      $scope.testModel3 = 0;
      $scope.testModel4 = '34';
      $scope.testModel5 = '067';

      /**
       * float, max 2 decimal digits, 2 decimals precision
       * @type {Object}
       */
      $scope.options1 = {
        decimalSeparator: ',',
        decimalCount: 2
      };

      /**
       * percentage value without decimals
       * @type {Object}
       */
      $scope.options2 = {
        maxValue: 100,
        minValue: -9
      };

      /**
       * percentage value without decimals
       * @type {Object}
       */
      $scope.options3 = {
        maxValue: 500,
        minValue: 0
      };

      /**
       * percentage value without decimals
       * @type {Object}
       */
      $scope.options4 = {
        maxValue: 500,
        minValue: 0,
        parseToNumber: false
      };

      /**
       * percentage value without decimals
       * @type {Object}
       */
      $scope.options5 = {
        maxValue: 500,
        minValue: 0,
        parseToNumber: false,
        allowedLeadingZeros: true,
        thousandsSeparator: '\''
      };

      $scope.type = function(model){
        return typeof model;
      }
  }]);