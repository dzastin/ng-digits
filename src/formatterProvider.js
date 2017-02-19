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