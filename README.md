## Angular directive allowing only digits in input

> Why another directive for numbers? Because I didn't find any one, that has all of this:

* written purely in angular 1.x
* you can extend almost everything (no inaccessible vars, many providers, that can be modified in config phase)
* option for leaving number as string and have leading zeros (like in policy or document numbers)

> install

```bash
bower install ng-digits
```

> Usage is very simple, just create options and set directive

```html
<input 
  type="text" 
  ng-model="testModel" 
  ng-digits="digitsOptions" />
```

```js
$scope.digitsOptions = {
  maxValue: 500,
  minValue: 0,
  parseToNumber: false,
  allowedLeadingZeros: true,
  thousandsSeparator: '\''
};
```

> available options

```js
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
    this.eventHandlers = {};```

> If you like this directive you can support me by here:
> https://www.paypal.me/dzastin