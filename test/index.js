var chai = require('chai'),
	should = chai.should(),
	expect = chai.expect,
    slack = require('../index');

describe('Initiation', function() {
	it('Should not be able to initiate without providing URL.', function() {
		expect(function() {
			slack();
		}).to.throw('URL is required.');
	});
	it('Should not be able to initiate with an invalid URL (string).', function() {
		var url = 'https://hooks.slack.com/services/T/B/X';
		expect(function() {
			slack(url);
		}).to.throw('Invalid URL.');
	});
	it('Should not be able to initiate with an invalid URL (object).', function() {
		var url = {
			t: 'T00000000',
			b: 'B00000000',
			x: 'XXXXXXXXXXXXXXXXXXXXXXXX'
		};
		expect(function() {
			slack(url);
		}).to.throw('Invalid URL.');
	});
	it('Should be able to initiate a valid URL.', function() {
		var url = 'https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX';
        expect(slack(url)).to.be.an('object');
    });
});

describe('Sending', function() {
	var _slack = null;
	before(function() {
		// Initiate with a valid but not working URL.
		_slack = slack('https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX');
	});
	
	it('Should not be able to send without providing a valid argument', function() {
		var types_to_test = [
			undefined,
			null,
			//'string',
			[],
			//{},
			0
		];

		for(var i = 0; i < types_to_test.length; i += 1) {
			expect(function() {
				_slack.send(types_to_test[i])
			}).to.throw('Invalid type on data. Must be either object or string.');
		}
	});

	it('Should not be able to send when providing an empty argument', function() {
		expect(function() {
			_slack.send('')
		}).to.throw('String cannot be empty.');

		expect(function() {
			_slack.send({})
		}).to.throw('Object cannot be empty.');
	});
});