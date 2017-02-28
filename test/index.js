var chai = require('chai'),
	should = chai.should(),
	expect = chai.expect,
    slack = require('../index');

describe('#send', function() {
	it('sets an undefined url', function() {
		expect(function() {
			slack();
		}).to.throw('URL is required.');
	});
	it('sets a valid url - string', function() {
		var url = 'https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX';
        expect(slack(url)).to.be.an('object');
    });
	it('sets an invalid url - string', function() {
		var url = 'https://hooks.slack.com/services/T/B/X';
		expect(function() {
			slack(url);
		}).to.throw('Invalid URL.');
	});
	it('sets a valid url - object', function() {
		var url = {
			t: 'T00000000',
			b: 'B00000000',
			x: 'XXXXXXXXXXXXXXXXXXXXXXXX'
		};
		expect(slack(url)).to.be.an('object');
    });
	it('sets an invalid url - object', function() {
		var url = {
			t: 'T',
			b: 'B',
			x: 'X'
		};
        expect(function() {
			slack(url);
		}).to.throw('Invalid URL.');
	});
});