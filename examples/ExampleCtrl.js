angular.module('example', [
  'ng-digits'
  ]).controller('ExampleCtrl', ['$scope',
    function($scope){
      $scope.testModel = 4567.45;

      /**
       * float, max 2 decimal digits, 2 decimals precision
       * @type {Object}
       */
      $scope.options1 = {
        decimalSeparator: ',',
        decimalCount: 2
      }
  }]);