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