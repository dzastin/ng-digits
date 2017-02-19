angular.module('ng-digits', []);
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
  .provider('ngDigitsFormatter', [function() {

    /**
     * Formatter
     * @type {Object}
     */
    var formatter = this;

    /**
     * Function passed to $formatters in ngModel
     * @param  {String} inputValue value from DOM
     * @return {String} value passed to ng-model
     */
    this.formatter = function(inputValue) {
      return inputValue;
    };

    /**
     * This returns value for factory/service
     * @return {Object} formatter
     */
    this.$get = [function(){
      return formatter;
    }];
  }]);
angular.module('ng-digits')
  .provider('ngDigitsParser', [function() {

    /**
     * Parser
     * @type {Object}
     */
    var parser = this;

    /**
     * Function passed to $parsers in ngModel
     * @param  {String} inputValue value from DOM
     * @return {String} value passed to ng-model
     */
    this.parser = function(inputValue) {
      return inputValue;
    };

    /**
     * This returns value for factory/service
     * @return {Object} parser
     */
    this.$get = [function(){
      return parser;
    }];
  }]);