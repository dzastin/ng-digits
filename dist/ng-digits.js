angular.module('ng-digits', [])
  .provider('ngDigitsConfig', [function(){
    var config = this;
    
    /**
     * Decimal separator
     * @type {String}
     */
    this.decimalSeparator = '.';

    /**
     * Thousands separator
     * @type {String}
     */
    this.thousandsSeparator = ' ';

    /**
     * Decimal places (if > 0, number has type float, otherwise int)
     * @type {Number}
     */
    this.decimalCount = 0;

    /**
     * Maximum value for input
     * @type {Number|null}
     */
    this.maxValue = null;

    /**
     * Minimum value for input
     * @type {Number|null}
     */
    this.minValue = null;

    /**
     * If true, ng-model will have Number, otherwise String
     * @type {Boolean}
     */
    this.parseToNumber = true;

    /**
     * If true, we allow to have leading zeros in ng-model
     * has no sense, if parseToNumber is set to true
     * @type {Boolean}
     */
    this.allowedLeadingZeros = false;

    /**
     * Getter for factory/service
     * @return {Object} config
     */
    this.$get = [function() {
      return config;
    }];


  }]);
angular.module('ng-digits')
  .provider('ngDigitsMainHelper', [function() {
    var ngDigitsMainHelper = this;

    /**
     * Returns 'pretty' string to paste in dom input
     * @param  {String|Number} numberValue number to parse
     * @param  {Object} config      direcitve config
     * @return {String} formatted number string
     */
    this.getStringForInput = function(numberValue, config) {
      // ensuring, that we have clean string model
      var numberValue = ngDigitsMainHelper.getValueForModel(numberValue, config) + '';

      // ensure, that there won't be strings like "null" or "NaN" in input
      if (isNaN(numberValue) || numberValue === null || numberValue === '') {
        return '';
      }

      // adding thousandSeparators (only for non decimal parts)
      var numberValueParts = numberValue.split('.');
      numberValueParts[0] = numberValueParts[0].replace(/\B(?=(\d{3})+(?!\d))/g, config.thousandsSeparator);
      numberValue = numberValueParts.join('.');

      // replacing decimal separators
      numberValue = numberValue.replace(new RegExp(ngDigitsMainHelper.escapeRegex('.'), 'g'), config.decimalSeparator);

      return numberValue;
    };

    /**
     * Parsing input value to ng-model value
     * @param  {String|Number} numberValue
     * @param  {Object} config      directive config
     * @return {String|Number}             string or number based on config
     */
    this.getValueForModel = function(numberValue, config) {
      // getting leading zeros
      var leadingZeros = ngDigitsMainHelper._getLeadingZeros(numberValue);

      // ensuring, that numberValue is String
      numberValue = angular.isDefined(numberValue) ? numberValue + '' : '';

      // removing thousands separators
      numberValue = numberValue.replace(new RegExp(ngDigitsMainHelper.escapeRegex(config.thousandsSeparator), 'g'), '');

      // removing decimal separators
      numberValue = numberValue.replace(new RegExp(ngDigitsMainHelper.escapeRegex(config.decimalSeparator), 'g'), '.');

      // parsing to number
      numberValue = config.decimalCount > 0 ? parseFloat(numberValue, 10) : parseInt(numberValue, 10);

      // roundind to allowed decimalPlaces
      var multiplier = Math.pow(10, config.decimalCount);
      numberValue = Math.round(numberValue * multiplier) / multiplier;

      // validating against min value
      if (config.minValue !== null && numberValue < config.minValue) {
        numberValue = config.minValue;
      }

      // validating against max value
      if (config.maxValue !== null && numberValue > config.maxValue) {
        numberValue = config.maxValue;
      }

      // we transorm value back to string, if that's dev's wish
      if (!config.parseToNumber) {
        numberValue += '';

        // recovering leading zeros
        if (config.allowedLeadingZeros) {
          // '005' => '5'
          if(numberValue === '0') {
            numberValue = leadingZeros;
          } else {
            numberValue = leadingZeros + numberValue;
          }
        }
      }
      

      // ensure, that there won't be "NaN" in model
      if (isNaN(numberValue)) {
        return null;
      }

      return numberValue;
    };

    /**
     * Return leading zeros of number
     * @param  {String} numberValue numberValue
     * @return {Sring} leading zeros
     */
    this._getLeadingZeros = function(numberValue){
      var leadingZeros = '';
      var stillZeros = true;
      numberValue += '';
      for(var i = 0; i < numberValue.length; i++) {
        if(numberValue[i] !== '0') {
          stillZeros = false;
        }
        if(stillZeros) {
          leadingZeros += '0';
        }
      }

      return leadingZeros;
    }

    /**
     * Returns escaped regexp string (for new RegExp func)
     * @param  {String} escapeString string to be escaped
     * @return {String} escaped string
     */
    this.escapeRegex = function(escapeString) {
      return escapeString.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    }

    /**
     * Getter for factory/service
     * @return {Object} ngDigitsMainHelper
     */
    this.$get = [function() {
      return ngDigitsMainHelper;
    }];

  }]);
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
        }
      };
    }]);
angular.module('ng-digits')
  .provider('ngDigitsEventHandler', ['$windowProvider', 'ngDigitsMainHelperProvider',
    function($windowProvider, ngDigitsMainHelperProvider) {

      /**
       * Handler
       * @type {Object}
       */
      var handler = this;

      /**
       * Handling keypress to prevent typing non digit values
       * @param  {Event} event keypress event
       * @param {Object} config directive config
       * @param {String} viewValue current value in input
       * @param {Object} input dom input element
       * 
       * @return {Boolean}
       */
      this.handleKeyPress = function(event, config, viewValue, input) {
        event = event || $windowProvider.$get().event;
        var charCode = angular.isUndefined(event.which) ? event.keyCode : event.which;
        var charStr = String.fromCharCode(charCode);

        // testing for non printable characters like backspace
        if(/[\x00-\x1F]/.test(charStr)) {
          return true;
        }

        // testing for other characters
        if (handler._blockFromTyping(charStr, config, viewValue, input)) {
          event.preventDefault();
          return false;
        }
        return true;
      };

      /**
       * Returns true, if we should prevent typing specified character
       * @param  {String} charStr   pressed character
       * @param {Object} config directive config
       * @param {String} viewValue current value in input
       * @param {Object} input dom input element
       * 
       * @return {Boolean}
       */
      this._blockFromTyping = function(charStr, config, viewValue, input) {
        viewValue = viewValue + '';
        var potentialNewViewValue = handler._getPotentialViewValue(charStr, viewValue, input); // potential value in input
        var potentialNewValue = ngDigitsMainHelperProvider.getValueForModel(potentialNewViewValue, config); // potential value in model
        var potentialNewViewValueSimplyParsed = potentialNewViewValue
          .replace(new RegExp(ngDigitsMainHelperProvider.escapeRegex(config.thousandsSeparator), 'g'), '') // removing thousand separators from potential value in input
          .replace(new RegExp(ngDigitsMainHelperProvider.escapeRegex(config.decimalSeparator), 'g'), '.'); // replacing decimal separators in potential value in input

        // dont accept thousandsSeparator or spaces
        if(charStr === config.thousandsSeparator || charStr === ' ') {
          return true;
        }

        // first char is for negative value, so we accept it
        if(config.minValue < 0 && viewValue === '' && charStr === '-') {
          return false;
        }

        // preventing from typing decimal separator for non float values
        if(charStr === config.decimalSeparator && !config.decimalCount) {
          return true;
        }

        // checking if potential view value in input is the same as potential value in model
        // except for the decimal separator at the end of string, so we can still type
        // numbers like 34, (resulting 34 in model)
        if(potentialNewValue + '' !== potentialNewViewValueSimplyParsed && potentialNewViewValueSimplyParsed.indexOf('.') !== potentialNewViewValueSimplyParsed.length -1) {
          return true;
        }

        return false;
      };

      /**
       * Return potentian new input value
       * @param  {Srtring} charStr   char in input
       * @param  {String} viewValue current value in input
       * @param  {DomElem} input     dom input element
       * @return {String} potential new input value
       */
      this._getPotentialViewValue = function(charStr, viewValue, input) {
        var viewValueParts = viewValue.split('');
        viewValueParts.splice(input.selectionStart, 0,charStr);
        return viewValueParts.join('');
      }

      /**
       * Handle paste event
       * @param  {Event} event   paste event
       * @param {Object} config directive config
       * @param  {Object} ngModel ngModelCtrl
       * @param  {Object} input angular.element
       * @return {undefined}
       */
      this.handlePaste = function(event, config, ngModel, input) {
        input = input[0]; // getting dom element
        var pastedData = event.clipboardData.getData('Text'); // clipboard text
        var chars = ngModel.$viewValue.split('');
        chars.splice(input.selectionStart, input.selectionEnd - input.selectionStart);
        var leftPart = chars.slice(0, input.selectionStart).join('');
        var rightPart = chars.slice(input.selectionStart).join('');
        var newValue = leftPart + pastedData + rightPart; // pasting clipboard into input value
        ngModel.$setViewValue(ngDigitsMainHelperProvider.getStringForInput(newValue, config));
        ngModel.$render();
        // setting up carret position at end of pasted data
        var newCarretPosition = (leftPart + pastedData).length + 1;
        input.setSelectionRange(newCarretPosition, newCarretPosition);
        event.preventDefault();
      }

      /**
       * This returns value for factory/service
       * @return {Object} handler
       */
      this.$get = [
        function() {

          return handler;
        }];
    }]);
angular.module('ng-digits')
  .provider('ngDigitsFormatter', ['ngDigitsMainHelperProvider',
    function(ngDigitsMainHelperProvider) {

      /**
       * Formatter
       * @type {Object}
       */
      var formatter = this;

      /**
       * Function passed to $formatters in ngModel
       * @param  {String} modelValue value from ng-model
       * @param {Object} config directive config
       * @param  {Object} ngModel ngModelCtrl
       * 
       * @return {String} value passed to ng-model
       */
      this.formatter = function(modelValue, config) {
        return ngDigitsMainHelperProvider.getStringForInput(modelValue, config);
      };

      /**
       * This returns value for factory/service
       * @return {Object} formatter
       */
      this.$get = [function() {
        return formatter;
      }];
    }]);
angular.module('ng-digits')
  .provider('ngDigitsParser', ['ngDigitsMainHelperProvider',
    function(ngDigitsMainHelperProvider) {

      /**
       * Parser
       * @type {Object}
       */
      var parser = this;

      /**
       * Function passed to $parsers in ngModel
       * @param  {String} inputValue value from DOM
       * @param {Object} config directive config
       * @param  {Object} ngModel ngModelCtrl
       * 
       * @return {String} value passed to ng-model
       */
      this.parser = function(inputValue, config) {
        return ngDigitsMainHelperProvider.getValueForModel(inputValue, config);
      };

      /**
       * This returns value for factory/service
       * @return {Object} parser
       */
      this.$get = [function() {
        return parser;
      }];
    }]);