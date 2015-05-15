var beapi = require('./beapi.js');
var expect = require('chai').expect;

var api = new beapi({
	baseUrl: 'http://testapi.lcl/api/v1/'
});

describe('beapi.js', function() {
    describe('hello world', function() {
    	var response = null;

    	beforeEach(function(done) {
    		var p = api.get('/');
    		p.then(function(res) {
    			response = res;
    			done();
    		}, function() {
    			console.log('noooo');
    			done();
    		});
    	});

    	it('it should return the hello world message', function() {
    		expect(response).to.not.equal(null);
    		expect(response.message).to.not.equal(undefined);
    		expect(response.message).to.equal('Hello World!');
    	});
    });
});