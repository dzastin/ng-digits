describe('test', function(){

    beforeEach(function () {
        browser.get('testcases.html');
    });

    it('should display default thousand separator', function(){

        element(by.model('models.default')).clear().sendKeys('12345');
        expect(element(by.model('models.default')).getAttribute('value')).toContain('12 345');
    });

    it('should not accept float values', function(){

        element(by.model('models.default')).clear().sendKeys('1234.5');
        expect(element(by.model('models.default')).getAttribute('value')).toContain('12 345');

    });

    it('should display plain decimal value', function(){

        element(by.model('models.default')).clear().sendKeys('123');
        expect(element(by.model('models.default')).getAttribute('value')).toContain('123');

    });

    it('should not allow numbers after 0', function(){

        element(by.model('models.default')).clear().sendKeys('00123');
        expect(element(by.model('models.default')).getAttribute('value')).toContain('0');

    });

    it('should display negative value', function(){

        element(by.model('models.default')).clear().sendKeys('-123');
        expect(element(by.model('models.default')).getAttribute('value')).toContain('-123');

    });

    it('should not allow "-" in middle of string', function(){

        element(by.model('models.default')).clear().sendKeys('1-23');
        expect(element(by.model('models.default')).getAttribute('value')).toContain('123');

    });


    it('model should be number', function(){

        element(by.model('models.default')).clear().sendKeys('123');
        element(by.model('models.default')).evaluate('models.default').then(function(value) {
            expect(value).toBe(123);
        });

    });

});
