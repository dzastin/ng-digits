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
      this.parser = function(inputValue, config, ngModelCtrl) {
        var simulationConfig = angular.copy(config);
        simulationConfig.maxValue = null;
        simulationConfig.parseToNumber = true;
        var simulationValue = ngDigitsMainHelperProvider.getValueForModel(inputValue, simulationConfig);
        if(config.maxValue !== null && parseFloat(simulationValue) > config.maxValue) {
          return ngModelCtrl.$modelValue;
        } else {
          return ngDigitsMainHelperProvider.getValueForModel(inputValue, config);
        }
      };

      /**
       * This returns value for factory/service
       * @return {Object} parser
       */
      this.$get = [function() {
        return parser;
      }];
    }]);