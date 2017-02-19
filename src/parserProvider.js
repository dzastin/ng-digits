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