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

          /**
           * Config regeneration
           * @param  {Object} ngDigits 
           * @return {undefined}
           */
          this._regenerateConfig = function(ngDigits) {
            if (ngDigits && angular.isObject(ngDigits)) {
              angular.extend(config, ngDigits);
            }
          };


          /** watching for changes in config */
          this._regenerateConfig($scope.ngDigits);
          $scope.$watch('ngDigits', this._regenerateConfig, true);


          /**
           * Settings up $formatter func
           */
          ngModel.$formatters.push(function(modelValue) {
            return ngDigitsFormatter.formatter(modelValue, config, ngModel);
          });

          /**
           * Setting up $parser func
           */
          ngModel.$parsers.push(function(inputValue) {
            return ngDigitsParser.parser(inputValue, config, ngModel);
          });

          /**
           * making sure, that if the viewValue changes, it stays valid
           */
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
            ngDigitsEventHandler.handlePaste(event, config, ngModel, iElm);
          });

          /**
           * Setting onKeyPress event handler
           */
          iElm.on('keypress', function(event) {
            return ngDigitsEventHandler.handleKeyPress(event, config, ngModel.$viewValue, this);
          });

          /**
           * Setting up custom event handlers from config
           */
          if(angular.isObject(config.eventHandlers) && config.eventHandlers) {
            angular.forEach(config.eventHandlers, function(eventHandler, eventCode){
              if(angular.isFunction(eventHandler)){
                iElm.on(eventCode, function(event){
                  eventHandler(event, config, ngModel, this);
                });
              }
            });
          }
        }
      };
    }]);