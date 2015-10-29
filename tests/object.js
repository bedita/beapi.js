describe('BEObject', function() {
    var beapi, createdObject;

    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;

	describe('load', function () {
		it('it should load the library', function() {
            expect(BEApi).not.toBe(undefined);
			expect(BEObject).not.toBe(undefined);
			beapi = new BEApi({
	            baseUrl: CONF.baseUrl
	        });
        });
	});
	describe('get an object', function() {
        var object = null;
        beforeEach(function(done) {
            object = new BEObject({ id: CONF.publication_id }, beapi.conf);
			object
				.$query()
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
	describe('create an object simulating token expiration', function() {
        beforeEach(function(done) {
			beapi.auth(CONF.auth.username, CONF.auth.password).then().then(function(res) {
				BEApi.storage.setItem(beapi.conf.accessTokenExpireDate, 0);
	            createdObject = new BEObject({
					title: 'Test api',
					object_type: 'book',
					parents: [CONF.publication_id]
				}, beapi.conf);
				createdObject.$create().then(function (res) {
					//
				}, function (err) {
					console.log('fail', err);
				}).then(function () {
					done();
				});
			}, function () {
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
				createdObject.$remove().then(function () {
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
});
