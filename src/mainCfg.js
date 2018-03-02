angular.module('ng-digits', [])
  .provider('ngDigitsConfig', [function(){
    var config = this;
    
    /**
     * Decimal separator
     * @type {String}
     */
    this.decimalSeparator = '.';

    /**
     * Thousands separator
     * @type {String}
     */
    this.thousandsSeparator = ' ';

    /**
     * Decimal places (if > 0, number has type float, otherwise int)
     * @type {Number}
     */
    this.decimalCount = 0;

    /**
     * If we should pad model value to decimalcount
     * eg. 3.2 => 3.20, 4 => 4,00
     * @type {Boolean}
     */
    this.padToDecimalCount = false;

    /**
     * Maximum value for input
     * @type {Number|null}
     */
    this.maxValue = null;

    /**
     * Minimum value for input
     * @type {Number|null}
     */
    this.minValue = null;

    /**
     * If true, ng-model will have Number, otherwise String
     * @type {Boolean}
     */
    this.parseToNumber = true;

    /**
     * If true, we allow to have leading zeros in ng-model
     * has no sense, if parseToNumber is set to true
     * @type {Boolean}
     */
    this.allowedLeadingZeros = false;

    /**
     * Structure of this object:
     * {
     *     inputevent: fn()
     * }
     * 
     * for example: 
     * {
     *     keydown: function(event, ngDigitsConfig, ngModelCtrl, eventThis){ // all passed arguments
     *         console.log(event)
     *     }
     * }
     * 
     * the return statement of this fn will be returned in original event
     * 
     * @type {Object}
     */
    this.eventHandlers = {};

    /**
     * Getter for factory/service
     * @return {Object} config
     */
    this.$get = [function() {
      return config;
    }];


  }]);