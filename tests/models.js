describe('BEModel', function() {
    var model = null;

    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;

	var beapi = new BEApi({
		baseUrl: CONF.baseUrl
	});

	describe('create a model', function() {
		model = new BEModel({}, beapi.conf)
        it('it should return a object', function() {
            expect(model).not.toBe(null);
            expect(model.$id()).not.toBe(undefined);
        });
    });
	describe('add callbacks', function() {
		var triggered1 = false,
			triggered2 = false;

		model.$on('add', function (val) {
			triggered1 = val;
		});

		model.$on('add', function (val, val2) {
			triggered2 = val2;
		});

		model.$trigger('add', 'triggered', 11);

        it('should trigger the add event', function() {
            expect(triggered1).not.toBe(false);
			expect(triggered2).not.toBe(false);
			expect(triggered1).toEqual('triggered');
			expect(triggered2).toEqual(11);
        });
    });
	describe('remove callbacks', function() {
		var triggered1 = false,
			triggered2 = false;

		model.$on('add', function (val) {
			triggered1 = val;
		});

		model.$on('add', function (val, val2) {
			triggered2 = val2;
		});

		model.$off('add');

		model.$trigger('add', 'triggered', 11);

        it('should trigger the add event', function() {
            expect(triggered1).toEqual(false);
			expect(triggered2).toEqual(false);
        });
    });
});
