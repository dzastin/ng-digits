describe('test', function(){

    beforeEach(function () {
        browser.get('testcases.html');
    });

    /** default settings */

    it('[defaults] should display default thousand separator', function(){

        element(by.model('models.default')).clear().sendKeys('12345');
        expect(element(by.model('models.default')).getAttribute('value')).toContain('12 345');
    });

    it('[defaults] should not accept float values', function(){

        element(by.model('models.default')).clear().sendKeys('1234.5');
        expect(element(by.model('models.default')).getAttribute('value')).toContain('12 345');

    });

    it('[defaults] should display plain decimal value', function(){

        element(by.model('models.default')).clear().sendKeys('123');
        expect(element(by.model('models.default')).getAttribute('value')).toContain('123');

    });

    it('[defaults] should not allow numbers after 0', function(){

        element(by.model('models.default')).clear().sendKeys('00123');
        expect(element(by.model('models.default')).getAttribute('value')).toContain('0');

    });

    it('[defaults] should display negative value', function(){

        element(by.model('models.default')).clear().sendKeys('-123');
        expect(element(by.model('models.default')).getAttribute('value')).toContain('-123');

    });

    it('[defaults] should not allow "-" in middle of string', function(){

        element(by.model('models.default')).clear().sendKeys('1-23');
        expect(element(by.model('models.default')).getAttribute('value')).toContain('123');

    });


    it('[defaults] model should be number', function(){

        element(by.model('models.default')).clear().sendKeys('123');
        element(by.model('models.default')).evaluate('models.default').then(function(value) {
            expect(value).toBe(123);
        });

    });

    /** modified separators */

    it('[separators] model should be number', function(){

        element(by.model('models.separators')).clear().sendKeys('123456');
        element(by.model('models.separators')).evaluate('models.separators').then(function(value) {
            expect(value).toBe(123456);
        });

    });

    it('[separators] should display new thousand separator', function(){

        element(by.model('models.separators')).clear().sendKeys('12345');
        expect(element(by.model('models.separators')).getAttribute('value')).toContain('12\'345');
    });

    it('[separators] should accept float values', function(){

        element(by.model('models.separators')).clear().sendKeys('1234.5');
        expect(element(by.model('models.separators')).getAttribute('value')).toContain('12\'345');

    });

    it('[separators] should allow to type 1234,05', function(){

        element(by.model('models.separators')).clear().sendKeys('1234,05');
        expect(element(by.model('models.separators')).getAttribute('value')).toContain('1\'234,05');

    });

    it('[separators] should accept float values and result number in model', function(){

        element(by.model('models.separators')).clear().sendKeys('12345,656');
        element(by.model('models.separators')).evaluate('models.separators').then(function(value) {
            expect(value).toBe(12345.65);
        });

    });

    it('[separators] should not accept below minValue float values', function(){

        element(by.model('models.separators')).clear().sendKeys('-5,4');
        expect(element(by.model('models.separators')).getAttribute('value')).toContain('-5,');

    });

    it('[separators] should accept negative float values', function(){

        element(by.model('models.separators')).clear().sendKeys('-5,2');
        expect(element(by.model('models.separators')).getAttribute('value')).toContain('-5,2');

    });

    /** padding */

    // @todo figure out how to prperly test blur event
    // it('[padding] should padd zeros to decimals', function(){

    //     element(by.model('models.separators')).clear().sendKeys('123.0');
    //     element(by.model('models.default')).click(); // blur on above
    //     expect(element(by.model('models.separators')).getAttribute('value')).toContain('123,00');
    // }); 

    /** min max */

    it('[separators] should not accept below minValue values', function(){

        element(by.model('models.separators')).clear().sendKeys('-1');
        expect(element(by.model('models.separators')).getAttribute('value')).toContain('');

    });

    it('[separators] should not accept more then maxValue values', function(){

        element(by.model('models.separators')).clear().sendKeys('100');
        expect(element(by.model('models.separators')).getAttribute('value')).toContain('10');

    });


    /** string settings */

    it('[strings] should have string values in model', function(){

        element(by.model('models.strings')).clear().sendKeys('12345');
        element(by.model('models.strings')).evaluate('models.strings').then(function(value) {
            expect(value).toBe('12345');
        });

    });

    it('[strings] should not allow leading zeros', function(){

        element(by.model('models.strings')).clear().sendKeys('0123');
        element(by.model('models.strings')).evaluate('models.strings').then(function(value) {
            expect(value).toBe('0');
        });

    });

    /** string with leading zeros settings */

    it('[leading] should allow leading zeros', function(){

        element(by.model('models.leading')).clear().sendKeys('000123');
        element(by.model('models.leading')).evaluate('models.leading').then(function(value) {
            expect(value).toBe('000123');
        });

    });

    /** initial model is null */

    it('[nullModel] should allow to type values', function(){

        element(by.model('models.nullBug')).clear().sendKeys('1');
        expect(element(by.model('models.nullBug')).getAttribute('value')).toContain('1');
        element(by.model('models.nullBug')).evaluate('models.nullBug').then(function(value) {
            expect(value).toBe(null);
        });

    });

});
