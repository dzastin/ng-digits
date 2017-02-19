angular.module('example', [
  'ng-digits'
  ]).controller('ExampleCtrl', ['$scope',
    function($scope){
      $scope.testModel = 4;
  }]);