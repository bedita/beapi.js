var System = require('traceur/src/node/System.js'),
	expect = require('chai').expect,
	conf = require('./test.json'),
	home = process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'],
	LocalStorage = require('node-localstorage').LocalStorage,
	XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;

describe('beapi.js', function() {
    var beapi, createdObject;

	describe('load', function () {
		beforeEach(function(done) {
			Promise.all(
        		['./src/beapi.next.js', './src/collection.next.js', './src/object.next.js'].map(function(x) {
					return System.import(x)
				})
			).then(function (modules) {
				BEApi = modules[0].BEApi;
				BECollection = modules[1].BECollection;
				BEObject = modules[2].BEObject;
				done();
			});
        });

		it('it should load the library', function() {
            expect(BEApi).to.not.equal(undefined);
			expect(BECollection).to.not.equal(undefined);
			expect(BEObject).to.not.equal(undefined);
        });
	});
	describe('instance', function () {
		beforeEach(function(done) {
			BEApi.storage = new LocalStorage(home + '/beapi');
			BEApi.xhr = XMLHttpRequest;
	        beapi = new BEApi({
	            baseUrl: conf.baseUrl
	        });
			done();
        });

		it('it should instantiate BEApi', function() {
            expect(beapi).to.not.equal(undefined);
        });
	});
	describe('authentication:login', function() {
        beforeEach(function(done) {
            var p = beapi.auth(conf.auth.username, conf.auth.password);
            p.then(function(res) {
                done();
            }, function() {
                done();
            });
        });

        it('it should return access and refresh tokens', function() {
            expect(beapi.getAccessToken()).to.not.equal(undefined);
            expect(beapi.getRefreshToken()).to.not.equal(undefined);
            expect(beapi.getAccessTokenExpireDate()).to.not.equal(undefined);
            expect(typeof beapi.getAccessToken()).to.equal('string');
            expect(typeof beapi.getRefreshToken()).to.equal('string');
        });
    });
	describe('authentication:refresh', function() {
        var accessToken;
		this.timeout(5000);

        beforeEach(function(done) {
			setTimeout(function () {
				accessToken = beapi.getAccessToken();
	            beapi.refreshToken().then(function(res) {
	                done();
	            }, function(res) {
	                done();
	            });
			}, 1000);
        });

        it('it should return the a new access token after refresh', function() {
            expect(beapi.getAccessToken()).to.not.equal(undefined);
            expect(accessToken).to.not.equal(beapi.getAccessToken());
        });
    });
	describe('get an object', function() {
        var object = null;
        beforeEach(function(done) {
            object = new BEObject({ id: conf.publication_id }, beapi.getConfiguration());
			object
				.query()
				.relation('attach')
				.relation('poster')
				.get()
				.then(function(obj) {
					response = obj;
					done();
	            }, function(err) {
					console.log('fail', err);
	                done();
	            });
        });

        it('it should return a be object', function() {
            expect(object).to.not.equal(null);
            expect(typeof object.id).to.equal('number');
            expect(typeof object.nickname).to.equal('string');
        });
    });
	describe('create an object', function() {
        beforeEach(function(done) {
            createdObject = new BEObject({
				title: 'Test api',
				object_type: 'book',
				parents: [conf.publication_id]
			}, beapi.getConfiguration());
			createdObject.create().then(function () {
				done();
			}, function (err) {
				console.log('fail', err);
				done();
			});
        });

        it('it should return a be object', function() {
            expect(createdObject).to.not.equal(undefined);
            expect(typeof createdObject.id).to.equal('number');
            expect(typeof createdObject.nickname).to.equal('string');
        });
    });
	describe('remove an object', function () {
		var removed = false;
		beforeEach(function(done) {
			if (createdObject) {
				createdObject.remove().then(function () {
					removed = true;
					done();
				}, function (err) {
					console.log('fail', err);
					done();
				});
			} else {
				done();
			}
        });

        it('it should return a be object', function() {
            expect(removed).to.equal(true);
        });
	});
	describe('get a collection', function() {
        var collection = null;

        beforeEach(function(done) {
            collection = new BECollection({ url: 'objects' }, beapi.getConfiguration());
			collection.fetch().then(function(obj) {
				response = obj;
                done();
            }, function(err) {
				console.log('fail', err);
                done();
            });
        });

        it('it should return a be object', function() {
            expect(collection).to.not.equal(null);
            expect(collection.length).to.be.above(0);
            expect(collection[0].constructor.name).to.equal('BEObject');
        });
    });
	describe('authentication:logout', function() {
        var hasLogout = false;

        beforeEach(function(done) {
			beapi.logout().then(function() {
				hasLogout = true;
				done();
			}, function(res) {
				done();
			});
        });

        it('it should logout and destroy the session', function() {
            expect(beapi.getAccessToken()).to.equal(undefined);
            expect(hasLogout).to.equal(true);
        });
    });
});
