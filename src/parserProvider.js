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