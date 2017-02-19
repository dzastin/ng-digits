angular.module('ng-digits')
  .provider('ngDigitsEventHandler', ['$windowProvider', 
    function($windowProvider) {

    /**
     * Handler
     * @type {Object}
     */
    var handler = this;

    /**
     * Handling keypress to prevent typing non digit values
     * @param  {Event} event keypress event
     * @return {Boolean}
     */
    this.keyPress = function(event) {
      event = event || $windowProvider.$get().event;
      var charCode = angular.isUndefined(event.which) ? event.keyCode : event.which;
      var charStr = String.fromCharCode(charCode);
      if (!(/\d/.test(charStr))) {
        event.preventDefault();
        return false;
      }
      return true;
    };

    /**
     * This returns value for factory/service
     * @return {Object} handler
     */
    this.$get = [function() {
      return handler;
    }];
  }]);