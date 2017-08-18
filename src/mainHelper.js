angular.module('ng-digits')
  .provider('ngDigitsMainHelper', [function() {
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

      // ensure, that there won't be strings like "null" or "NaN" in input
      if (isNaN(numberValue) || numberValue === null || numberValue === '') {
        return '';
      }

      // adding thousandSeparators (only for non decimal parts)
      var numberValueParts = numberValue.split('.');
      numberValueParts[0] = numberValueParts[0].replace(/\B(?=(\d{3})+(?!\d))/g, config.thousandsSeparator);
      numberValue = numberValueParts.join('.');

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
      if (config.parseToNumber) {
        numberValue = config.decimalCount > 0 ? parseFloat(numberValue, 10) : parseInt(numberValue, 10);

        // roundind to allowed decimalPlaces
        var multiplier = Math.pow(10, config.decimalCount);
        numberValue = Math.round(numberValue * multiplier) / multiplier;

        // validating against min value
        if (config.minValue !== null && numberValue < config.minValue) {
          numberValue = config.minValue;
        }

        // validating against max value
        if (config.maxValue !== null && numberValue > config.maxValue) {
          numberValue = config.maxValue;
        }
      }

      // ensure, that there won't be "NaN" in model
      if (isNaN(numberValue)) {
        return null;
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
    this.$get = [function() {
      return ngDigitsMainHelper;
    }];

  }]);