angular.module('ng-digits')
  .directive('ngDigits', ['ngDigitsFormatter', 'ngDigitsParser', 'ngDigitsEventHandler', 'ngDigitsConfig', 'ngDigitsMainHelper',
    function(ngDigitsFormatter, ngDigitsParser, ngDigitsEventHandler, ngDigitsConfig, ngDigitsMainHelper){
    // Runs during compile
    return {
      scope: {
        ngDigitsFormatter: '='
      },
      require: 'ngModel',
      restrict: 'A',
      link: function($scope, iElm, iAttrs, ngModel) {

        /**
         * Configuration for this specific instance of directive
         * @type {Object}
         */
        var config = angular.copy(ngDigitsConfig);
        if(angular.isObject($scope.ngDigitsFormatter)) {
          angular.extend(config, $scope.ngDigitsFormatter);
        }

        /**
         * Settings up $formatter func
         */
        ngModel.$formatters.push(function(modelValue){
          return ngDigitsFormatter.formatter(modelValue, config);
        });

        /**
         * Setting up $parser func
         */
        ngModel.$parsers.push(function(inputValue){
          return ngDigitsParser.parser(inputValue, config);
        });

        ngModel.$viewChangeListeners.push(function(){
          ngModel.$setViewValue(ngDigitsMainHelper.getStringForInput(ngModel.$viewValue, config));
          ngModel.$render();
        });

        /**
         * Setting onKeyPress event handler
         */
        iElm.on('keypress', function(event){
          return ngDigitsEventHandler.keyPress(event, config);
        });
      }
    };
  }]);