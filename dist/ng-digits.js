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

      // adding thousandSeparators
      numberValue = numberValue.replace(/\B(?=(\d{3})+(?!\d))/g, config.thousandsSeparator);

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
     * @return {Boolean}
     */
    this.keyPress = function(event) {
      event = event || $windowProvider.$get().event;
      var charCode = angular.isUndefined(event.which) ? event.keyCode : event.which;
      var charStr = String.fromCharCode(charCode);
      if (!(/\d/.test(charStr))) {
        event.preventDefault();
        return false;
      }
      return true;
    };

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