var System = require('traceur/src/node/System.js'),
	expect = require('chai').expect,
	conf = require('./test.json'),
	home = process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'],
	LocalStorage = require('node-localstorage').LocalStorage,
	XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;

describe('beapi.js', function() {
    var beapi;

	describe('load', function () {
		beforeEach(function(done) {
            System.import('./src/beapi.next.js', {}).then(function (mod) {
				mod.BEApi.storage = new LocalStorage(home + '/beapi');
				mod.BEApi.xhr = XMLHttpRequest;
                beapi = new mod.BEApi({
                    baseUrl: conf.baseUrl
                });
				done();
            }, function (err) {
            	console.log(err);
				done();
            });
        });

		it('it should load the library', function() {
            expect(beapi).to.not.equal(undefined);
        });
	});
    describe('endpoint list', function() {
        var response = null;

        beforeEach(function(done) {
            var p = beapi.get('/');
            p.then(function(res) {
                response = res;
                done();
            }, function(err) {
                done();
            });
        });

        it('it should return the endpoint list', function() {
            expect(response).to.not.equal(null);
            expect(typeof response).to.equal('object');
        });
    });
    describe('authentication', function() {
        this.timeout(5000);

        var accessToken = null;
        var refreshToken = null;
        var expireTime = null;
        var profile = null;
        var newAccessToken = null;
        var hasLogout = false;
        var count = 0;

        beforeEach(function(done) {
            if (count == 0) {
                var p = beapi.auth(conf.auth.username, conf.auth.password);
                p.then(function(res) {
                    if (res && res.data) {
                        accessToken = res.data.access_token;
                        refreshToken = res.data.refresh_token;
                        expireTime = res.data.expires_in;
                    }
                    done();
                }, function() {
                    done();
                });
            }
            if (count == 1) {
                setTimeout(function() {
                    beapi.refreshToken().then(function(res) {
                        if (res && res.data) {
                            newAccessToken = res.data.access_token;
                            refreshToken = res.data.refresh_token;
                            expireTime = res.data.expires_in;
                        }
                        done();
                    }, function(res) {
                        done();
                    });
                }, 1000);
            }
            if (count == 2) {
                setTimeout(function() {
                    beapi.logout().then(function() {
                        hasLogout = true;
                        newAccessToken = beapi.getAccessToken();
                        done();
                    }, function(res) {
                        console.log(res);
                        done();
                    });
                }, 1500);
            }
            count++;
        });

        it('it should return access and refresh tokens', function() {
            expect(accessToken).to.not.equal(null);
            expect(refreshToken).to.not.equal(null);
            expect(expireTime).to.not.equal(null);
            expect(typeof accessToken).to.equal('string');
            expect(typeof refreshToken).to.equal('string');
        });

        it('it should return the a new access token after refresh', function() {
            expect(newAccessToken).to.not.equal(null);
            expect(accessToken).to.not.equal(newAccessToken);
        });

        it('it should logout and destroy the session', function() {
            expect(newAccessToken).to.equal(null);
            expect(hasLogout).to.equal(true);
        });
    });
	describe('get an object', function() {
        var object = null;
		this.timeout(5000);

        beforeEach(function(done) {
			Promise.all(
        		['./src/collection.next.js', './src/object.next.js'].map(function(x) {
					return System.import(x)
				})
			).then(function (modules) {
				BECollection = modules[0].BECollection;
				BEObject = modules[1].BEObject;
	            var p = new BEObject({ id: conf.publication_id }, beapi.conf);
				var q = p.query()
						.relation('attach')
						.relation('poster');

				q.get().then(function(obj) {
					response = obj;
	                done();
	            }, function(err) {
					console.log('fail', err);
	                done();
	            });
			}, done);
        });

        it('it should return a be object', function() {
            expect(response).to.not.equal(null);
            expect(typeof response.id).to.equal('number');
            expect(typeof response.nickname).to.equal('string');
        });
    });
	describe('get a collection', function() {
        var collection = null;
		this.timeout(5000);

        beforeEach(function(done) {
			Promise.all(
        		['./src/collection.next.js', './src/object.next.js'].map(function(x) {
					return System.import(x)
				})
			).then(function (modules) {
				BECollection = modules[0].BECollection;
				BEObject = modules[1].BEObject;
	            collection = new BECollection({ url: 'objects' }, beapi.conf);
				collection.fetch().then(function(obj) {
					response = obj;
	                done();
	            }, function(err) {
					console.log('fail', err);
	                done();
	            });
			}, done);
        });

        it('it should return a be object', function() {
            expect(collection).to.not.equal(null);
            expect(collection.length).to.be.above(0);
            expect(collection[0].constructor.name).to.equal('BEObject');
        });
    });
});
