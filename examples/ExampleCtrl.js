angular.module('example', [
  'ng-digits'
  ]).controller('ExampleCtrl', ['$scope',
    function($scope){
      $scope.testModel = 4567.45;
      $scope.testModel2 = 54;

      /**
       * float, max 2 decimal digits, 2 decimals precision
       * @type {Object}
       */
      $scope.options1 = {
        decimalSeparator: ',',
        decimalCount: 2
      }

      /**
       * percentage value without decimals
       * @type {Object}
       */
      $scope.options2 = {
        maxValue: 100,
        minValue: 0
      }
  }]);