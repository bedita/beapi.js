describe('BECollection', function() {
    var collection = null;

    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;

    var beapi = new BEApi({
        baseUrl: CONF.baseUrl
    });

	describe('get a collection', function() {
        beforeEach(function(done) {
            collection = new BECollection('objects', beapi.conf);
			collection.$fetch().then(function(obj) {
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
	describe('add an object to the collection', function() {
		var title = 'New Title';

        beforeEach(function(done) {
            collection.push({
				title: title
			});
			done();
        });

        it('the last object of the collection should be a BEObject', function() {
            expect(collection[collection.length - 1].constructor.name).toEqual('BEObject');
			expect(collection[collection.length - 1].title).toEqual(title);
        });
    });
	describe('remove a collection object', function() {
		var length;

        beforeEach(function(done) {
			setTimeout(function () {
				length = collection.length;
				var obj = collection[length - 1];
	            obj.$remove().then(function () {
	            	done();
	            }, function (err) {
					console.log('fail', err);
	            	done();
	            });
			});
        });

        it('update the collection', function() {
            expect(collection.length).toEqual(length - 1);
        });
    });
});
