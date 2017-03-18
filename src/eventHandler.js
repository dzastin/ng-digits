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
      this.handleKeyPress = function(event, config, viewValue, input) {
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
        if (viewValueParts.length > 1 && viewValueParts[1].length >= config.decimalCount && input.selectionStart > decimalSeparatorPosition) {
          return true;
        }

        return false;
      };

      /**
       * This returns value for factory/service
       * @return {Object} handler
       */
      this.$get = ['ngDigitsMainHelper',
        function(ngDigitsMainHelper) {

          /**
           * Handle paste event
           * @param  {Event} event   paste event
           * @param {Object} config directive config
           * @param  {Object} ngModel ngModelCtrl
           * @param  {Object} input angular.element
           * @return {undefined}
           */
          handler.handlePaste = function(event, config, ngModel, input) {
            input = input[0]; // getting dom element
            var pastedData = event.clipboardData.getData('Text'); // clipboard text
            var chars = ngModel.$viewValue.split('');
            chars.splice(input.selectionStart, input.selectionEnd - input.selectionStart);
            var leftPart = chars.slice(0, input.selectionStart).join('');
            var rightPart = chars.slice(input.selectionStart).join('');
            var newValue = leftPart + pastedData + rightPart; // pasting clipboard into input value
            ngModel.$setViewValue(ngDigitsMainHelper.getStringForInput(newValue, config));
            ngModel.$render();
            // setting up carret position at end of pasted data
            var newCarretPosition = (leftPart + pastedData).length + 1;
            input.setSelectionRange(newCarretPosition, newCarretPosition);
            event.preventDefault();
          }

          return handler;
        }];
    }]);