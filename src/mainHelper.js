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