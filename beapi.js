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

		if (opt.headers && 'object' == typeof headers) {
			for (var k in opt.headers) {
				oReq.setRequestHeader(k, opt.headers[k]);
			}
		}

		if (opt.type == 'POST' || opt.type == 'PUT' && opt.data !== undefined) {
			oReq.send(opt.data);
		} else {
			oReq.send();
		}

		return dfr.promise;
	}

	beapi.prototype.optionsBuilder = function(options) {
		var res = options || {};

		var url = options.url || this.baseUrl;
		if (/^([\w\-]+:)?\/{2,3}/.test(url)) {
			if (url.indexOf(this.baseUrl) !== 0) {
				throw new Exception('Invalid url');
			}
		} else {
			if (url[0] !== '/') {
				url = this.baseUrl + (this.baseUrl[this.baseUrl.length - 1]) == '/' ? url : '/' + url;
			} else {
				url = this.baseUrl + (this.baseUrl[this.baseUrl.length - 1]) == '/' ? url.slice(1) : url;
			}
		}
		res['url'] = url;

		var accessToken = this.getAccessToken();
		if (accessToken) {
			res['headers'] = (res['headers'] && 'object' == typeof res['headers']) ? res['headers'] : {};
			res['headers']['Authorization'] = 'Bearer ' + accessToken;
		}

		return res;
	}

	beapi.prototype.getAccessToken = function() {
		return storage.getItem('access');
	}

	beapi.prototype.get = function(options) {
		var build = this.optionsBuilder(options);
		return this.xhr(options);
	}
	
})();