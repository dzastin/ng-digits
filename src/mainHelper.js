angular.module('ng-digits')
  .provider('ngDigitsMainHelper', [function() {
    var ngDigitsMainHelper = this;

    /**
     * Returns 'pretty' string to paste in dom input
     * @param  {String|Number} numberValue number to parse
     * @param  {Object} config      direcitve config
     * @param  {Boolean} fullFormat
     * 
     * @return {String} formatted number string
     */
    this.getStringForInput = function(numberValue, config, fullFormat) {

      // allowing negative number char
      if((config.minValue === null || config.minValue < 0) && numberValue === '-') {
        return '-';
      }

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

      // padding zeros
      if(fullFormat) {
        var decimalSeparatorIndex = numberValue.indexOf(config.decimalSeparator);
        if(config.padToDecimalCount) {
          var toPad = config.decimalCount;
          if(decimalSeparatorIndex > -1) {
            toPad = config.decimalCount - numberValue.substr(decimalSeparatorIndex+1).length;
          } else {
            numberValue += config.decimalSeparator;
          }
          if(toPad > 0) {
            for(var i = 0; i < toPad; i++) {
              numberValue += '0';
            }
          }

        }
      }

      return numberValue;
    };

    /**
     * Parsing input value to ng-model value
     * @param  {String|Number} numberValue
     * @param  {Object} config      directive config
     * @return {String|Number}             string or number based on config
     */
    this.getValueForModel = function(numberValue, config) {
      // getting leading zeros
      var leadingZeros = ngDigitsMainHelper._getLeadingZeros(numberValue);

      // ensuring, that numberValue is String
      numberValue = angular.isDefined(numberValue) ? numberValue + '' : '';

      // removing thousands separators
      numberValue = numberValue.replace(new RegExp(ngDigitsMainHelper.escapeRegex(config.thousandsSeparator), 'g'), '');

      // removing decimal separators
      numberValue = numberValue.replace(new RegExp(ngDigitsMainHelper.escapeRegex(config.decimalSeparator), 'g'), '.');

      // parsing to number
      numberValue = config.decimalCount > 0 ? parseFloat(numberValue, 10) : parseInt(numberValue, 10);

      // roundind to allowed decimalPlaces
      var multiplier = Math.pow(10, config.decimalCount);
      numberValue = Math.round(numberValue * multiplier) / multiplier;

      // validating against min value
      if (config.minValue !== null && numberValue < config.minValue) {
        numberValue = null;
      }

      // validating against max value
      if (config.maxValue !== null && numberValue > config.maxValue) {
        numberValue = null;
      }

      // we transorm value back to string, if that's dev's wish
      if (!config.parseToNumber) {
        numberValue += '';

        // recovering leading zeros
        if (config.allowedLeadingZeros) {
          // '005' => '5'
          if(numberValue === '0') {
            numberValue = leadingZeros;
          } else {
            numberValue = leadingZeros + numberValue;
          }
        }
      }
      

      // ensure, that there won't be "NaN" in model
      if (isNaN(numberValue)) {
        return null;
      }

      return numberValue;
    };

    /**
     * Return leading zeros of number
     * @param  {String} numberValue numberValue
     * @return {Sring} leading zeros
     */
    this._getLeadingZeros = function(numberValue){
      var leadingZeros = '';
      var stillZeros = true;
      numberValue += '';
      for(var i = 0; i < numberValue.length; i++) {
        if(numberValue[i] !== '0') {
          stillZeros = false;
        }
        if(stillZeros) {
          leadingZeros += '0';
        }
      }

      return leadingZeros;
    }

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