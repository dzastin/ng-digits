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
     * 
     * @return {Boolean}
     */
    this.keyPress = function(event, config, viewValue) {
      event = event || $windowProvider.$get().event;
      var charCode = angular.isUndefined(event.which) ? event.keyCode : event.which;
      var charStr = String.fromCharCode(charCode);

      if (handler._blockFromTyping(charStr, config, viewValue)) {
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
     * 
     * @return {Boolean}
     */
    this._blockFromTyping = function(charStr, config, viewValue) {
      // Is this char proper decimal separator (as set in config, and only one in string)
      var isAllowedDecimalSeparator = config.decimalCount > 0 && viewValue.indexOf(config.decimalSeparator) === -1 && charStr === config.decimalSeparator;

      if (!isAllowedDecimalSeparator && !(/\d/.test(charStr))) {
        return true;
      }

      // do we have a propoer decimal length
      var viewValueParts = viewValue.split(config.decimalSeparator);
      if(viewValueParts.length > 1 && viewValueParts[1].length >= config.decimalCount) {
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