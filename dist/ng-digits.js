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
  .provider('ngDigitsMainHelper', [function(){
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
      if(isNaN(numberValue) || numberValue === null || numberValue === '') {
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
      // ensuring, that numberValue is String
      numberValue = angular.isDefined(numberValue) ? numberValue + '' : '';

      // removing thousands separators
      numberValue = numberValue.replace(new RegExp(ngDigitsMainHelper.escapeRegex(config.thousandsSeparator), 'g'), '');

      // removing decimal separators
      numberValue = numberValue.replace(new RegExp(ngDigitsMainHelper.escapeRegex(config.decimalSeparator), 'g'), '.');

      // parsing to number
      if(config.parseToNumber) {
        numberValue = config.decimalCount > 0 ? parseFloat(numberValue, 10) : parseInt(numberValue, 10);

        // roundind to allowed decimalPlaces
        var multiplier = Math.pow(10, config.decimalCount);
        numberValue = Math.round(numberValue * multiplier)/multiplier;
      }

      // ensure, that there won't be "NaN" in model
      if(isNaN(numberValue)) {
        return null;
      }

      return numberValue;
    };

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
    this.$get = [function(){
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
           * @todo
           */
          // iElm.on('paste', function(event){
          //   ngModel.$setViewValue(ngDigitsMainHelper.getStringForInput(ngModel.$viewValue, config));
          //   ngModel.$render();
          //   event.preventDefault();
          // });

          /**
           * Setting onKeyPress event handler
           */
          iElm.on('keypress', function(event) {
            return ngDigitsEventHandler.keyPress(event, config, ngModel.$viewValue, this);
          });
        }
      };
    }]);
angular.module('ng-digits')
  .provider('ngDigitsEventHandler', ['$windowProvider', 
    function($windowProvider) {

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
    this.keyPress = function(event, config, viewValue, input) {
      event = event || $windowProvider.$get().event;
      var charCode = angular.isUndefined(event.which) ? event.keyCode : event.which;
      var charStr = String.fromCharCode(charCode);

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
      // Is this char proper decimal separator (as set in config, and only one in string)
      var isAllowedDecimalSeparator = config.decimalCount > 0 && viewValue.indexOf(config.decimalSeparator) === -1 && charStr === config.decimalSeparator;

      if (!isAllowedDecimalSeparator && !(/\d/.test(charStr))) {
        return true;
      }

      // do we have a propoer decimal length
      var viewValueParts = viewValue.split(config.decimalSeparator);
      var decimalSeparatorPosition = viewValue.indexOf(config.decimalSeparator);
      if(viewValueParts.length > 1 && viewValueParts[1].length >= config.decimalCount && input.selectionStart > decimalSeparatorPosition) {
        return true;
      }

      return false;
    }

    /**
     * This returns value for factory/service
     * @return {Object} handler
     */
    this.$get = [function() {
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
    this.$get = [function(){
      return parser;
    }];
  }]);