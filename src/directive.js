angular.module('ng-digits')
  .directive('ngDigits', ['ngDigitsFormatter', 'ngDigitsParser', 'ngDigitsEventHandler',
    function(ngDigitsFormatter, ngDigitsParser, ngDigitsEventHandler){
    // Runs during compile
    return {
      scope: {},
      require: 'ngModel',
      restrict: 'A',
      link: function($scope, iElm, iAttrs, ngModel) {

        /**
         * Settings up $formatter func
         */
        ngModel.$formatters.push(ngDigitsFormatter.formatter);

        /**
         * Setting up $parser func
         */
        ngModel.$parsers.push(ngDigitsParser.parser);

        /**
         * Setting onKeyPress event handler
         */
        iElm.on('keypress', ngDigitsEventHandler.keyPress);
      }
    };
  }]);