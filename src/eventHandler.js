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

        // cmd or ctrl btns - fixes problem with keyboard pasting on firefox
        if(event.metaKey) {
          return true;
        }

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
        if((config.minValue === null || config.minValue < 0) && (angular.isUndefined(viewValue) || viewValue === '') && charStr === '-') {
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
        var clipboardData = event.clipboardData;
        if(!clipboardData && event.originalEvent) {
          clipboardData = event.originalEvent.clipboardData;
        }
        var pastedData = clipboardData.getData('Text'); // clipboard text
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