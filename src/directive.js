angular.module('ng-digits')
  .directive('ngDigits', ['ngDigitsFormatter', 'ngDigitsParser', 'ngDigitsEventHandler', 'ngDigitsConfig', 'ngDigitsMainHelper',
    function(ngDigitsFormatter, ngDigitsParser, ngDigitsEventHandler, ngDigitsConfig, ngDigitsMainHelper) {
      // Runs during compile
      return {
        scope: {
          ngDigits: '='
        },
        require: 'ngModel',
        restrict: 'A',
        link: function($scope, iElm, iAttrs, ngModel) {

          /**
           * Configuration for this specific instance of directive
           * @type {Object}
           */
          var config = angular.copy(ngDigitsConfig);
          if (angular.isObject($scope.ngDigits)) {
            angular.extend(config, $scope.ngDigits);
          }

          /**
           * Settings up $formatter func
           */
          ngModel.$formatters.push(function(modelValue) {
            return ngDigitsFormatter.formatter(modelValue, config);
          });

          /**
           * Setting up $parser func
           */
          ngModel.$parsers.push(function(inputValue) {
            return ngDigitsParser.parser(inputValue, config);
          });

          ngModel.$viewChangeListeners.push(function() {
            var carretPosition = iElm[0].selectionStart;
            var initialModelLength = ngModel.$viewValue.length;
            ngModel.$setViewValue(ngDigitsMainHelper.getStringForInput(ngModel.$viewValue, config));
            ngModel.$render();
            // preservind carret position when we type not in the end of input
            var newSelectionStart = initialModelLength === ngModel.$viewValue.length ? carretPosition : carretPosition + 1;
            iElm[0].setSelectionRange(newSelectionStart, newSelectionStart);
          });

          /**
           * Setting onPaste event handler
           */
          iElm.on('paste', function(event){
            var pastedData = event.clipboardData.getData('Text'); // clipboard text
            var chars = ngModel.$viewValue.split('');
            chars.splice(this.selectionStart, this.selectionEnd - this.selectionStart);
            var leftPart = chars.slice(0, this.selectionStart).join('');
            var rightPart = chars.slice(this.selectionStart).join('');
            var newValue = leftPart + pastedData + rightPart; // pasting clipboard into input value
            ngModel.$setViewValue(ngDigitsMainHelper.getStringForInput(newValue, config));
            ngModel.$render();
            // setting up carret position at end of pasted data
            var newCarretPosition = (leftPart + pastedData).length + 1;
            iElm[0].setSelectionRange(newCarretPosition, newCarretPosition);
            event.preventDefault();
          });

          /**
           * Setting onKeyPress event handler
           */
          iElm.on('keypress', function(event) {
            return ngDigitsEventHandler.keyPress(event, config, ngModel.$viewValue, this);
          });
        }
      };
    }]);