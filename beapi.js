(function() {

	var storage = null;
	var xhr = null;

	var beapi = function(options) {
		options = options || {};
		for (var k in options) {
			this[k] = options[k];
		}
	}

	if ('object' == typeof module && 'object' == typeof module.exports) {
		var LocalStorage = require('node-localstorage').LocalStorage;
		storage = new LocalStorage('./beapi');
		xhr = require("xmlhttprequest").XMLHttpRequest;
		module.exports = beapi;
	} else {
		storage = window.localStorage;
		xhr = XMLHttpRequest;
		window.beapi = beapi;
	}

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

	beapi.prototype.baseUrl = ''

	try {
		beapi.prototype.baseUrl = window.location.protocol + "//" + window.location.hostname + (window.location.port ? ':' + window.location.port: '') + '/api/v1/';
	} catch (ex) {
		//
	}

	var Promise = function() {
		this.callbacks = {
			y: [],
			n: []
		}
	}

	Promise.prototype = {

		callbacks: {},

		then: function(y, n) {
			if (y && 'function' == typeof y) {
				this.callbacks.y.push(y);
			}
			if (n && 'function' == typeof n) {
				this.callbacks.n.push(n);	
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
		var promise = new Promise();
		var oReq = new xhr();

		oReq.addEventListener('load', function(ev) {
			var callbacks = promise.callbacks.y;
			var data = oReq.responseText;
			if (!oReq.responseText) {
				callbacks = promise.callbacks.n;
			} else {
				try {
					data = JSON.parse(oReq.responseText);
				} catch(er) {
					//
				}
			}
			for (var i = 0; i < callbacks.length; i++) {
				if (oReq.responseText)
				callbacks[i].call(this, data, ev);
			}
		}, false);
		oReq.addEventListener('error', function(ev) {
			var callbacks = promise.callbacks.n;
			for (var i = 0; i < callbacks.length; i++) {
				callbacks[i].call(this, oReq.responseText, ev);
			}
		}, false);
		oReq.addEventListener('abort', function(ev) {
			var callbacks = promise.callbacks.n;
			for (var i = 0; i < callbacks.length; i++) {
				callbacks[i].call(this, oReq.responseText, ev);
			}
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

		return promise;
	}

	beapi.prototype.optionsBuilder = function(options) {
		var res = options || {};

		///URL
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
		///

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