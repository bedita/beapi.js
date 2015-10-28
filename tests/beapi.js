describe('beapi.js', function() {
    var beapi, createdObject;

    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;

	describe('load', function () {
		it('it should load the library', function() {
            expect(BEApi).not.toBe(undefined);
			expect(BECollection).not.toBe(undefined);
			expect(BEObject).not.toBe(undefined);
        });
	});
	describe('instance', function () {
		beforeEach(function(done) {
	        beapi = new BEApi({
	            baseUrl: CONF.baseUrl
	        });
			done();
        });

		it('it should instantiate BEApi', function() {
            expect(beapi).not.toBe(undefined);
        });
	});
	describe('authentication:login', function() {
        beforeEach(function(done) {
            var p = beapi.auth(CONF.auth.username, CONF.auth.password);
            p.then().then(function(res) {
                done();
            });
        });

        it('it should return access and refresh tokens', function() {
            expect(beapi.getAccessToken()).not.toBe(undefined);
            expect(beapi.getRefreshToken()).not.toBe(undefined);
            expect(beapi.getAccessTokenExpireDate()).not.toBe(undefined);
            expect(typeof beapi.getAccessToken()).toEqual('string');
            expect(typeof beapi.getRefreshToken()).toEqual('string');
        });
    });
    describe('authentication:refresh', function() {
        var accessToken;

        beforeEach(function(done) {
			setTimeout(function () {
				accessToken = beapi.getAccessToken();
	            beapi.refreshToken().then().then(function () {
					done();
				});
			}, 1000);
        });

        it('it should return the a new access token after refresh', function() {
            expect(beapi.getAccessToken()).not.toBe(undefined);
            expect(accessToken).not.toBe(beapi.getAccessToken());
        });
    });
	describe('get an object simulating token expiration', function() {
        var object = null;
        beforeEach(function(done) {
            BEApi.storage.setItem(beapi.conf.accessTokenExpireDate, 0);
            object = new BEObject({ id: CONF.publication_id }, beapi.conf);
			object
				.query()
				.relation('attach')
				.relation('poster')
				.get()
				.then(function(obj) {
					response = obj;
	            }, function(err) {
					console.log('fail', err);
	            }).then(function () {
					done();
				});
        });

        it('it should return a be object', function() {
            expect(object).not.toBe(null);
            expect(typeof object.id).toEqual('number');
            expect(typeof object.nickname).toEqual('string');
        });
    });
	describe('create an object', function() {
        beforeEach(function(done) {
            createdObject = new BEObject({
				title: 'Test api',
				object_type: 'book',
				parents: [CONF.publication_id]
			}, beapi.conf);
			createdObject.create().then(function (res) {
				//
			}, function (err) {
				console.log('fail', err);
			}).then(function () {
				done();
			});
        });

        it('it should return a be object', function() {
            expect(createdObject).not.toBe(undefined);
            expect(typeof createdObject.id).toEqual('number');
            expect(typeof createdObject.nickname).toEqual('string');
        });
    });
	describe('remove an object', function () {
		var removed = false;
		beforeEach(function(done) {
			if (createdObject) {
				createdObject.remove().then(function () {
					removed = true;
				}, function (err) {
					console.log('fail', err);
				}).then(function () {
					done();
				});
			} else {
				done();
			}
        });

        it('it should return a be object', function() {
            expect(removed).toEqual(true);
        });
	});
	describe('get a collection', function() {
        var collection = null;

        beforeEach(function(done) {
            collection = new BECollection({ url: 'objects' }, beapi.conf);
			collection.fetch().then(function(obj) {
				response = obj;
            }, function(err) {
				console.log('fail', err);
            }).then(function () {
				done();
			});
        });

        it('it should return a be object', function() {
            expect(collection).not.toBe(null);
            expect(collection.length).toBeGreaterThan(0);
            expect(collection[0].constructor.name).toEqual('BEObject');
        });
    });
	describe('authentication:logout', function() {
        var hasLogout = false;

        beforeEach(function(done) {
			beapi.logout().then(function() {
				hasLogout = true;
			}, function (err) {
				console.log(err);
			}).then(function () {
				done();
			});
        });

        it('it should logout and destroy the session', function() {
            expect(beapi.getAccessToken()).toEqual(undefined);
            expect(hasLogout).toEqual(true);
        });
    });
});
