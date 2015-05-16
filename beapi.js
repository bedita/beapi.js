(function() {

	var storage = null;
	var xhr = null;

	var _defaults = function() {
		var res = {};
		for (var i = 0; i < arguments.length; i++) {
			var obj = arguments[i];
			for (var k in obj) {
				res[k] = obj[k];
			}
		}
		return res;
	}

	var Deferred = function() {
		this.promise = new Promise();
	}

	Deferred.prototype.resolve = function() {
		var promise = this.promise;
		if (promise.status == 'pending') {
			promise.status = 'resolved';
			promise.resolveArgs = arguments;
			var callbacks = promise.callbacks.y;
			for (var i = 0; i < callbacks.length; i++) {
				callbacks[i].apply(promise, arguments);
			}
		}
	}

	Deferred.prototype.reject = function() {
		var promise = this.promise;
		if (promise.status == 'pending') {
			promise.status = 'rejected';
			promise.rejectArgs = arguments;
			var callbacks = promise.callbacks.n;
			for (var i = 0; i < callbacks.length; i++) {
				callbacks[i].apply(promise, arguments);
			}
		}
	}

	var Promise = function() {
		this.status = 'pending';
		this.resolveArgs = [];
		this.rejectArgs = [];
		this.callbacks = {
			y: [],
			n: []
		}
	}

	Promise.prototype = {
		callbacks: {},
		then: function(y, n) {
			if (y && 'function' == typeof y) {
				if (this.status == 'pending') {
					this.callbacks.y.push(y);
				} else if (this.status == 'resolved') {
					y.apply(this, this.resolveArgs)
				}
			}
			if (n && 'function' == typeof n) {
				if (this.status == 'pending') {
					this.callbacks.n.push(n);	
				} else if (this.status == 'rejected') {
					n.apply(this, this.rejectArgs)
				}
			}
			return this;
		},
		done: function(y) {
			return this.then.call(this, y);
		},
		success: function() {
			return this.done.apply(this, arguments);
		},
		error: function(n) {
			return this.then.call(this, null, n);
		},
		fail: function() {
			return this.error.apply(this, arguments);
		}
	};

	var beapi = function(options) {
		options = options || {};
		for (var k in options) {
			this[k] = options[k];
		}
	}

	if ('object' == typeof module && 'object' == typeof module.exports) {
		var LocalStorage = require('node-localstorage').LocalStorage;
		storage = new LocalStorage('./beapi');
		xhr = require('xmlhttprequest').XMLHttpRequest;
		module.exports = beapi;
	} else {
		storage = window.localStorage;
		xhr = XMLHttpRequest;
		window.beapi = beapi;
	}

	beapi.prototype.baseUrl = '';

	beapi.accessTokenKey = 'be_access_token';
	beapi.refreshTokenKey = 'be_refresh_token';
	beapi.accessTokenExpireDate = 'be_access_token_expire_date';

	try {
		beapi.prototype.baseUrl = window.location.protocol + '//' + window.location.hostname + (window.location.port ? ':' + window.location.port: '') + '/api/v1/';
	} catch (ex) {
		//
	}

	// options is a API uri builder result
	beapi.prototype.xhr = function(options) {
		var defaults = {
			type: 'GET',
			url: this.baseUrl,
			async: true,
			responseType: 'text/json',
			headers: {},
			data: undefined
		}
		var opt = _defaults(defaults, options || {});
		opt.type = opt.type.toUpperCase();
		var dfr = new Deferred();
		var oReq = new xhr();

		oReq.addEventListener('load', function() {
			var data = oReq.responseText;
			if (data) {
				try {
					data = JSON.parse(data);
				} catch(er) {
					//
				}
			}
			if (oReq.status >= 200 && oReq.status < 400) {
				dfr.resolve(data, oReq);
			} else {
				dfr.reject(data, oReq);
			}
		}, false);

		oReq.addEventListener('error', function() {
			dfr.reject(oReq.responseText, oReq);
		}, false);

		oReq.addEventListener('abort', function() {
			dfr.reject(oReq.responseText, oReq);
		}, false);

		oReq.open(opt.type, opt.url, opt.async);
		oReq.responseType = opt.responseType;
		if (opt.headers && 'object' == typeof opt.headers) {
			for (var k in opt.headers) {
				oReq.setRequestHeader(k, opt.headers[k]);
			}
		}

		if (opt.type == 'POST' || opt.type == 'PUT' && opt.data !== undefined) {
			var data = opt.data;
			if ('object' == typeof data) {
				data = JSON.stringify(data);
			}
			oReq.send(data);
		} else {
			oReq.send();
		}

		return dfr.promise;
	}

	var optionsBuilder = function(be, options) {
		var res = options || {};

		var url = options.url || be.baseUrl;
		if (/^([\w\-]+:)?\/{2,3}/.test(url)) {
			if (url.indexOf(be.baseUrl) !== 0) {
				throw new Exception('Invalid url');
			}
		} else {
			if (url[0] !== '/') {
				url = be.baseUrl + ((be.baseUrl[be.baseUrl.length - 1]) == '/' ? url : '/' + url);
			} else {
				url = be.baseUrl + ((be.baseUrl[be.baseUrl.length - 1]) == '/' ? url.slice(1) : url);
			}
		}
		res['url'] = url;

		var accessToken = be.getAccessToken();
		if (accessToken) {
			res['headers'] = (res['headers'] && 'object' == typeof res['headers']) ? res['headers'] : {};
			res['headers']['Authorization'] = 'Bearer ' + accessToken;
		}

		return res;
	}

	var processXHR = function(be, options) {
		options = options || {};
		if (be.getAccessToken() && be.isTokenExpired()) {
			var dfr = new Deferred();
			var doXHR = function() {
				be.xhr(options).then(function() {
					dfr.resolve.apply(this, arguments);
				}, function() {
					dfr.reject.apply(this, arguments);
				});
			}
			be.refreshToken().then(function() {
				doXHR();
			}, function() {
				delete options.headers['Authorization'];
				doXHR();
			});
			return dfr.promise;
		} else {
			return be.xhr(options);
		}
	}

	var processInput = function(options) {
		if (typeof options == 'string') {
			options = { url: options };
		}
		return options;
	}

	beapi.prototype.get = function(options) {
		options = options ? processInput(options) : {};
		options.type = 'GET';
		options = optionsBuilder(this, options);
		return processXHR(this, options);
	}

	beapi.prototype.post = function(options) {
		options = options ? processInput(options) : {};
		options.type = 'POST';
		options = optionsBuilder(this, options);
		return processXHR(this, options);
	}

	beapi.prototype.put = function(options) {
		options = options ? processInput(options) : {};
		options.type = 'PUT';
		options = optionsBuilder(this, options);
		return processXHR(this, options);
	}

	beapi.prototype.delete = function(options) {
		options = options ? processInput(options) : {};
		options.type = 'DELETE';
		options = optionsBuilder(this, options);
		return processXHR(this, options);
	}

	var processAuth = function(be, options) {
		options.url = 'auth';
		var promise = be.post(options);
		promise.then(function(res) {
			if (res && res.data && res.data.access_token) {
				storage.setItem(beapi.accessTokenKey, res.data.access_token);
				storage.setItem(beapi.refreshTokenKey, res.data.refresh_token);
				storage.setItem(beapi.accessTokenExpireDate, Date.now() + res.data.expires_in * 1000);
			} else {
				storage.removeItem(beapi.accessTokenKey);
				storage.removeItem(beapi.refreshTokenKey);
				storage.removeItem(beapi.accessTokenExpireDate);
			}
		}, function() {
			storage.removeItem(beapi.accessTokenKey);
			storage.removeItem(beapi.refreshTokenKey);
			storage.removeItem(beapi.accessTokenExpireDate);
		});
		return promise;
	}

	beapi.prototype.auth = function(user, pwd) {
		var options = {
			data: {
				username: user,
				password: pwd
			}
		}
		return processAuth(this, options);
	}

	beapi.prototype.refreshToken = function() {
		var options = {
			data: {
				grant_type: 'refresh_token',
				refresh_token: this.getRefreshToken(),
			}
		}
		return processAuth(this, options);
	}

	beapi.prototype.logout = function() {
		var promise = this.processXHR({
				type: 'DELETE'
			});

		promise.done(function() {
			if (res && res.data && res.data.logout) {
				storage.removeItem(beapi.accessTokenKey);
				storage.removeItem(beapi.refreshTokenKey);
				storage.removeItem(beapi.accessTokenExpireDate);
			}
		});

		return promise;
	}

	beapi.prototype.getAccessToken = function() {
		return storage.getItem(beapi.accessTokenKey);
	}

	beapi.prototype.getRefreshToken = function() {
		return storage.getItem(beapi.refreshTokenKey);
	}

	beapi.prototype.getAccessTokenExpireDate = function() {
		return storage.getItem(beapi.accessTokenExpireDate);
	}

	beapi.prototype.isTokenExpired = function() {
		return Date.now() >= this.getAccessTokenExpireDate();
	}

})();