describe('BEApi', function() {
    var beapi;

    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;

	describe('load', function () {
		it('it should load the library', function() {
            expect(BEApi).not.toBe(undefined);
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
