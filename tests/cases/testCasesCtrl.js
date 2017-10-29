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
        default: {}
      };

  }]);