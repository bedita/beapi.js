'use strict';

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var BEModel = (function () {
	function BEModel(conf) {
		_classCallCheck(this, BEModel);

		this.__config = conf;
		this.__modified = [];
	}

	_createClass(BEModel, [{
		key: '_config',
		value: function _config(conf) {
			if (conf) {
				this.__config = conf;
			}
			return this.__config;
		}
	}, {
		key: '_modified',
		value: function _modified(key) {
			if (key === false) {
				this.__modified = [];
			} else if (key && this.__modified.indexOf(key) === -1) {
				this.__modified.push(key);
			}
			return this.__modified;
		}
	}], [{
		key: 'unsetFromData',
		get: function get() {
			return ['__modified', '__config'];
		}
	}]);

	return BEModel;
})();

var BEArray = (function (_Array) {
	_inherits(BEArray, _Array);

	function BEArray(items, conf) {
		_classCallCheck(this, BEArray);

		_get(Object.getPrototypeOf(BEArray.prototype), 'constructor', this).call(this, items);
		this.__config = conf;
	}

	_createClass(BEArray, [{
		key: '_config',
		value: function _config(conf) {
			if (conf) {
				this.__config = conf;
			}
			return this.__config;
		}
	}, {
		key: '_modified',
		value: function _modified(key) {
			if (key === false) {
				this.__modified = [];
			} else if (key && this.__modified.indexOf(key) === -1) {
				this.__modified.push(key);
			}
			return this.__modified;
		}
	}], [{
		key: 'unsetFromData',
		get: function get() {
			return ['__modified', '__config'];
		}
	}]);

	return BEArray;
})(Array);
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x3, _x4, _x5) { var _again = true; _function: while (_again) { var object = _x3, property = _x4, receiver = _x5; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x3 = parent; _x4 = property; _x5 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var BECollection = (function (_BEArray) {
	_inherits(BECollection, _BEArray);

	function BECollection() {
		var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
		var conf = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

		_classCallCheck(this, BECollection);

		_get(Object.getPrototypeOf(BECollection.prototype), 'constructor', this).call(this, [], conf);
		var items = [];
		if (options.alias) {
			this.alias = options.alias;
			if (options.filter) {
				items = options.alias.filter(options.filter) || [];
			} else {
				items = options.alias.items || [];
			}
		} else {
			items = options.items || options.objects || [];
		}
		this.url = options.url;
		for (var i = 0; i < items.length; i++) {
			this.push(items[i]);
		}
		if (items.length < options.count) {
			this.push({});
		}
	}

	_createClass(BECollection, [{
		key: 'push',
		value: function push(obj) {
			if (!(obj instanceof BEObject)) {
				obj = new BEObject(obj, this._config());
			}
			Array.prototype.push.call(this, obj);
		}
	}, {
		key: 'fetch',
		value: function fetch(url) {
			var that = this;
			return new Promise(function (resolve, reject) {
				if (that.url || url) {
					if (that.alias) {
						return that.alias.fetch(that.url || url || undefined);
					}
					that.splice(0, that.length);
					var beapi = new BEApi(that._config());
					beapi.get(that.url || url).then(function (res) {
						if (res && res.data && res.data.objects) {
							for (var i = 0; i < res.data.objects.length; i++) {
								var obj = res.data.objects[i];
								that.push(obj);
							}
						}
						resolve.apply(this, arguments);
					}, function () {
						reject.apply(this, arguments);
					});
				} else {
					reject();
				}
			});
		}
	}, {
		key: 'filter',
		value: function filter(f) {
			return Array.prototype.filter.call(this, function (item) {
				return item.is(f);
			});
		}
	}, {
		key: 'toArray',
		value: function toArray() {
			return Array.prototype.slice.call(this, 0);
		}
	}]);

	return BECollection;
})(BEArray);
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x4, _x5, _x6) { var _again = true; _function: while (_again) { var object = _x4, property = _x5, receiver = _x6; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x4 = parent; _x5 = property; _x6 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var isoDateRegex = /\d{4,}\-\d{2,}\-\d{2,}T\d{2,}:\d{2,}:\d{2,}\+\d{4,}/;

var BEObject = (function (_BEModel) {
    _inherits(BEObject, _BEModel);

    function BEObject() {
        var data = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
        var conf = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

        _classCallCheck(this, BEObject);

        _get(Object.getPrototypeOf(BEObject.prototype), 'constructor', this).call(this, conf);
        this.set(data);
    }

    _createClass(BEObject, [{
        key: 'fetch',
        value: function fetch() {
            var that = this;
            return new Promise(function (resolve, reject) {
                if (that.id) {
                    var promise = new BEApi(that._config()).get('objects/' + that.id);
                    promise.then(function (res) {
                        if (res && res.data && res.data.object) {
                            that.set(res.data.object);
                            that._modified(false);
                        } else {
                            reject(res);
                        }
                    }, function (err) {
                        reject(err);
                    });
                    return promise;
                } else {
                    reject();
                }
            });
        }
    }, {
        key: 'save',
        value: function save() {
            var data = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

            var that = this;
            this.set(data);
            var dataToSend = this.toJSON(this._modified());
            dataToSend.id = this.id;
            return new Promise(function (resolve, reject) {
                var promise = new BEApi(that._config()).post('objects', {
                    data: dataToSend
                });
                promise.then(function (res) {
                    if (res && res.data && res.data.object) {
                        that.set(res.data.object);
                        that._modified(false);
                        resolve(res);
                    } else {
                        reject(res);
                    }
                }, function (err) {
                    reject(err);
                });
            });
        }
    }, {
        key: 'set',
        value: function set(data) {
            var that = this;
            var relations = data.relations || {};
            var children = data.children || {};
            var relationList = data.relations ? {} : false;
            var childrenList = data.children ? {} : false;

            var defineRelation = function defineRelation(name, options) {
                that.relations[name] = new BECollection(options, that._config());
            };

            for (var k in relations) {
                if (!that.relations) {
                    that.relations = {};
                }
                defineRelation(k, relations[k]);
            }

            if (children && !this.children) {
                this.children = new BECollection({
                    url: children.url,
                    count: children.count
                }, that._config());
                if (children.sections) {
                    this.sections = new BECollection({
                        alias: this.children,
                        filter: {
                            object_type: 'Section'
                        },
                        url: children.sections.url,
                        count: children.sections
                    }, that._config());
                }
            }

            for (var k in data) {
                var d = data[k];
                //check if iso date
                if (typeof d == 'string' && d.length == 24 && isoDateRegex.test(d)) {
                    var convert = new Date(d);
                    if (!isNaN(convert.valueOf())) {
                        d = convert;
                    }
                }
                if (that[k] !== d) {
                    that[k] = d;
                    this._modified(k);
                }
            }

            if (data.parent_id) {
                this.parent = new BEObject({
                    id: data.parent_id
                });
                delete this.parent_id;
            } else {
                delete this.parent;
            }

            return that;
        }
    }, {
        key: 'is',
        value: function is(filter) {
            if (typeof filter == 'object') {
                for (var k in filter) {
                    if (filter[k] !== this[k]) {
                        return false;
                    }
                }
                return true;
            }
            return false;
        }
    }, {
        key: 'query',
        value: function query() {
            var that = this;
            var queue = new BEApiQueue(this._config());
            if ('id' in this && 'nickname' in this) {
                queue.identity(this);
            } else {
                queue.objects(this.id || this.nickname);
            }
            queue.all(function (scope) {
                that.set(scope);
                that._modified(false);
            });
            return queue;
        }
    }, {
        key: 'toJSON',
        value: function toJSON(keys) {
            var res = {},
                data = this;
            for (var k in data) {
                if (BEObject.unsetFromData.indexOf(k) === -1 && typeof data[k] !== 'function' && (!keys || !Array.isArray(keys) || keys.indexOf(k) !== -1)) {
                    res[k] = data[k];
                }
            }
            return res;
        }
    }]);

    return BEObject;
})(BEModel);
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var BEXhr = (function () {
	function BEXhr() {
		_classCallCheck(this, BEXhr);
	}

	_createClass(BEXhr, null, [{
		key: 'exec',
		value: function exec() {
			var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

			var defaults = {
				type: 'GET',
				async: true,
				responseType: 'json',
				headers: {},
				data: undefined
			};

			var opt = {},
			    merge = [defaults, options];
			for (var i = 0; i < merge.length; i++) {
				var obj = merge[i];
				for (var k in obj) {
					opt[k] = obj[k];
				}
			}
			opt.type = opt.type.toUpperCase();
			return new Promise(function (resolve, reject) {
				var oReq = new BEXhr.xhr();

				oReq.addEventListener('load', function () {
					var data = oReq.response || oReq.responseText;
					if (data) {
						try {
							data = JSON.parse(data);
						} catch (er) {
							//
						}
					}
					if (oReq.status >= 200 && oReq.status < 400) {
						resolve(data);
					} else {
						reject(data);
					}
				}, false);

				oReq.addEventListener('error', function () {
					reject(oReq);
				}, false);

				oReq.addEventListener('abort', function () {
					reject(oReq);
				}, false);

				oReq.responseType = opt.responseType;
				oReq.open(opt.type, opt.url, opt.async);
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
			});
		}
	}, {
		key: 'xhr',
		get: function get() {
			if (this._xhr) {
				return this._xhr;
			} else {
				if ('object' == typeof module && 'object' == typeof module.exports) {
					return this.xhr = require('xmlhttprequest').XMLHttpRequest;
				} else {
					return window.XMLHttpRequest;
				}
			}
		},
		set: function set(xhr) {
			this._xhr = xhr;
		}
	}]);

	return BEXhr;
})();
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

/**
 * Convenience method to process request arguments
 * - If the argument is String typed, set it as url attribute of a set of options
 * @private
 * @param {String|Object} conf The request arguments.
 * @return {Object} A valid set of options for the request.
 */
function _processInput() {
	var conf = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

	if (conf) {
		if (typeof conf == 'string') {
			conf = { url: conf };
		}
		return conf;
	}
}

/**
 * Convenience method to extend a JavaScript Object
 * @private
 * @param {Object} res The object to extend.
 * @param {Object} ...args A list of objects to use to extend the first one.
 * @return {Object} The extended object.
 */
function _extend() {
	var res = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

	for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
		args[_key - 1] = arguments[_key];
	}

	for (var i = 0; i < args.length; i++) {
		var obj = args[i];
		for (var k in obj) {
			res[k] = obj[k];
		}
	}
	return res;
}

/**
 * A registry of BEApi configuration.
 * Everywhere, in your JavaScript application, you can use `BEApiRegistry.getInstance(key)` to retrieve a BEApi configration.
 * Register BEApi configurations is lighter and simpler than register instances.
 * Use BEApiRegistry to share configuration between models, interfaces and queues.
 * @class
 */

var BEApiRegistry = (function () {
	function BEApiRegistry() {
		_classCallCheck(this, BEApiRegistry);
	}

	/**
  * Create an interface to communicate with a BEdita API frontend.
  * @class
  */

	_createClass(BEApiRegistry, null, [{
		key: 'add',

		/**
   * Add a configuration using the provided key.
   * @param {String} key The key to use to register the configuration.
   * @param {Object} conf The configuration.
   */
		value: function add(key) {
			var conf = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

			BEApiRegistry._instances = BEApiRegistry._instances || {};
			BEApiRegistry._instances[key] = conf;
		}

		/**
   * Retrieve a configuration using the provided key.
   * @param {String} key The key to use to read the configuration.
   * @return {Object} The configuration.
   */
	}, {
		key: 'getInstance',
		value: function getInstance(key) {
			BEApiRegistry._instances = BEApiRegistry._instances || {};
			if (typeof BEApiRegistry._instances[key] !== 'undefined') {
				return BEApiRegistry._instances[key];
			}
		}

		/**
   * Remove a configuration using the provided key.
   * @param {String} key The key to use to remove the configuration.
   * @return {Boolean} If the configuration exists, return `true` after remotion, otherwise return `false`.
   */
	}, {
		key: 'remove',
		value: function remove(key) {
			BEApiRegistry._instances = BEApiRegistry._instances || {};
			if (typeof BEApiRegistry._instances[key] !== 'undefined') {
				delete BEApiRegistry._instances[key];
				return true;
			}
			return false;
		}
	}]);

	return BEApiRegistry;
})();

var BEApi = (function () {

	/**
  * Instantiate a BEApi Object.
  * @constructor
  * @param {Object} conf A set of options.
  */

	function BEApi() {
		var conf = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

		_classCallCheck(this, BEApi);

		/**
   * A set of options.
   * @namespace
   * @property {String} baseUrl 				The base frontend endpoint.
   * @property {String} configKey 			The registry key to use to store this BEApi configuration (@see {@link BEApiRegistry}).
   * @property {String} accessTokenKey 		The storage key to use for Access Token when using auth methods.
   * @property {String} refreshTokenKey		The storage key to use for Refresh Token when using auth methods.
   * @property {String} accessTokenExpireDate The storage key to use for Access Token Expire Date when using auth methods.
   */
		var opt = {
			baseUrl: undefined,
			accessTokenKey: 'be_access_token',
			refreshTokenKey: 'be_refresh_token',
			accessTokenExpireDate: 'be_access_token_expire_date',
			configKey: this.defaultConfigKey
		};

		for (var k in conf) {
			opt[k] = conf[k];
		}

		// if the base url is not provided, try to extract it from the `window.location`.
		if (!opt.baseUrl) {
			try {
				opt.baseUrl = window.location.protocol + '//' + window.location.hostname + (window.location.port ? ':' + window.location.port : '') + '/api/latest/';
			} catch (ex) {
				//
			}
		}

		this.conf = opt;
		// add the current configuration to the BEApiRegistry.
		BEApiRegistry.add(this.configKey, this.conf);
	}

	/**
  * The default register configuration key.
  * @type {String}
  */

	_createClass(BEApi, [{
		key: 'getConfiguration',

		/**
   * Get instance configuration object.
   * @type {object}
   */
		value: function getConfiguration() {
			return this.conf;
		}

		/**
   * Process and return a complete set of options for the Ajax request.
   * - Automatically set the authorization headers
   * - Automatically set the frontend base url when a not full url is passed
   * @private
   * @param {Object} opt A set of options to pass to the Ajax request.
   * @return {Object} A complete set of options.
   */
	}, {
		key: '_processOptions',
		value: function _processOptions(opt) {
			var res = this.conf;
			for (var k in opt) {
				res[k] = opt[k];
			}

			var url = res.url || '/',
			    accessToken = this.getAccessToken();

			// check if the provided url is a complete
			if (/^([\w\-]+:)?\/{2,3}/.test(url)) {
				// check if the provided is url is valid (hostname == BEdita frontend host)
				if (url.indexOf(res.baseUrl) !== 0) {
					throw 'Invalid url';
				}
			} else if (url[0] !== '/') {
				url = res.baseUrl + (res.baseUrl[res.baseUrl.length - 1] == '/' ? url : '/' + url);
			} else {
				url = res.baseUrl + (res.baseUrl[res.baseUrl.length - 1] == '/' ? url.slice(1) : url);
			}

			res['url'] = url;

			if (accessToken) {
				res['headers'] = res['headers'] && 'object' == typeof res['headers'] ? res['headers'] : {};
				res['headers']['Authorization'] = 'Bearer ' + accessToken;
			}

			res.type = res.method = res.type || res.method || 'GET';

			return res;
		}

		/**
   * Perform the Ajax request.
   * - If Access Tokens is expired, try to renew it before perform the request
   * - Use {@link BEXhr}
   * @private
   * @param {Object} opt A complete set of options to pass to the Ajax request.
   * @return {Promise} The Ajax request Promise.
   */
	}, {
		key: '_processXHR',
		value: function _processXHR() {
			var opt = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

			if (this.getAccessToken() && this.isTokenExpired()) {
				return new Promise(function (resolve, reject) {
					var doXHR = function doXHR() {
						delete opt.headers['Authorization'];
						opt = this._processOptions(opt);
						BEXhr.exec(opt).then(function () {
							resolve.apply(this, arguments);
						}, function () {
							reject.apply(this, arguments);
						});
					};
					this.refreshToken().then(doXHR, doXHR);
				});
			} else {
				return BEXhr.exec(opt);
			}
		}

		/**
   * Perform the Ajax request for Authentication.
   * - Automatically store Access Token, Refresh Token and Expire Date to the storage (@see {@link BEApi.storage}).
   * @private
   * @param {Object} opt A complete set of options to pass to the Ajax request.
   * @return {Promise} The Ajax request Promise.
   */
	}, {
		key: '_processAuth',
		value: function _processAuth() {
			var opt = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

			opt.url = 'auth';
			var self = this,
			    storage = BEApi.storage,
			    conf = this.conf,
			    promise = this.post(opt);
			promise.then(function (res) {
				if (res && res.data && res.data.access_token) {
					storage.setItem(conf.accessTokenKey, res.data.access_token);
					storage.setItem(conf.refreshTokenKey, res.data.refresh_token);
					storage.setItem(conf.accessTokenExpireDate, Date.now() + res.data.expires_in * 1000);
				} else {
					storage.removeItem(conf.accessTokenKey);
					storage.removeItem(conf.refreshTokenKey);
					storage.removeItem(conf.accessTokenExpireDate);
				}
			}, function () {
				storage.removeItem(conf.accessTokenKey);
				storage.removeItem(conf.refreshTokenKey);
				storage.removeItem(conf.accessTokenExpireDate);
			});
			return promise;
		}

		/**
   * Convenience method to set the BEdita API frontend base url.
   * @param {String} url The url to set.
   * @return {Object} The BEApi instance.
   */
	}, {
		key: 'setBaseUrl',
		value: function setBaseUrl(url) {
			this.conf.baseUrl = url;
			return this;
		}

		/**
   * Perform an API GET request.
   * - Automatically set `GET` as request method.
   * - Use {@link _processOptions} and {@link _processOptions}
   * @param {Object} conf A set of options to pass to the Ajax request.
   * @return {Promise} The Ajax request Promise.
   */
	}, {
		key: 'get',
		value: function get() {
			var opt = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

			opt = _processInput(opt);
			opt.type = 'GET';
			opt = this._processOptions(opt);
			return this._processXHR(opt);
		}

		/**
   * Perform an API POST request.
   * - Automatically set `POST` as request method.
   * - Use {@link _processOptions} and {@link _processOptions}
   * @param {Object} conf A set of options to pass to the Ajax request.
   * @return {Promise} The Ajax request Promise.
   */
	}, {
		key: 'post',
		value: function post(opt, data) {
			if (opt === undefined) opt = {};

			opt = _processInput(opt);
			opt.data = data ? _extend(opt.data || {}, data) : opt.data;
			opt.type = 'POST';
			opt = this._processOptions(opt);
			return this._processXHR(opt);
		}

		/**
   * Perform an API PUT request.
   * - Automatically set `PUT` as request method.
   * - Use {@link _processOptions} and {@link _processOptions}
   * @param {Object} conf A set of options to pass to the Ajax request.
   * @return {Promise} The Ajax request Promise.
   */
	}, {
		key: 'put',
		value: function put(opt, data) {
			if (opt === undefined) opt = {};

			opt = _processInput(opt);
			opt.data = data ? _extend(opt.data || {}, data) : opt.data;
			opt.type = 'PUT';
			opt = this._processOptions(opt);
			return this._processXHR(opt);
		}

		/**
   * Perform an API DELETE request.
   * - Automatically set `DELETE` as request method.
   * - Use {@link _processOptions} and {@link _processOptions}
   * @param {Object} conf A set of options to pass to the Ajax request.
   * @return {Promise} The Ajax request Promise.
   */
	}, {
		key: 'delete',
		value: function _delete() {
			var opt = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

			opt = _processInput(opt);
			opt.type = 'DELETE';
			opt = this._processOptions(opt);
			return this._processXHR(opt);
		}

		/**
   * Perform an API Auth request.
   * - Use {@link _processAuth}
   * - Automatically store Access Token to the storage (@see {@link BEApi.storage}).
   * @param {String} username The username.
   * @param {String} password The user's password.
   * @return {Promise} The Ajax request Promise.
   */
	}, {
		key: 'auth',
		value: function auth(username, password) {
			var conf = {
				data: {
					username: username,
					password: password
				}
			};
			return this._processAuth(conf);
		}

		/**
   * Perform an API Refresh Token request.
   * - Use {@link _processAuth}
   * - Retrieve Access Token from the storage (@see {@link BEApi.storage}).
   * @return {Promise} The Ajax request Promise.
   */
	}, {
		key: 'refreshToken',
		value: function refreshToken() {
			var storage = BEApi.storage,
			    conf = this.conf,
			    opt = {
				data: {
					grant_type: 'refresh_token',
					refresh_token: this.getRefreshToken()
				}
			};
			storage.removeItem(conf.accessTokenKey);
			storage.removeItem(conf.accessTokenExpireDate);
			return this._processAuth(opt);
		}

		/**
   * Perform an API Logout request.
   * - Remove all BEApi data from the storage (@see {@link BEApi.storage}).
   * @return {Promise} The Ajax request Promise.
   */
	}, {
		key: 'logout',
		value: function logout() {
			var storage = BEApi.storage,
			    opt = this.conf,
			    promise = this['delete']({
				url: 'auth/' + this.getRefreshToken()
			});
			storage.removeItem(opt.accessTokenKey);
			storage.removeItem(opt.accessTokenExpireDate);

			var onLogout = function onLogout(res) {
				if (res && res.data && res.data.logout) {
					storage.removeItem(opt.refreshTokenKey);
				}
			};
			promise.then(onLogout, onLogout);
			return promise;
		}

		/**
   * Retrieve Access Token from the storage (@see {@link BEApi.storage}).
   * @return {String} The Access Token
   */
	}, {
		key: 'getAccessToken',
		value: function getAccessToken() {
			return BEApi.storage.getItem(this.conf.accessTokenKey) || undefined;
		}

		/**
   * Retrieve Refresh Token from the storage (@see {@link BEApi.storage}).
   * @return {String} The Refresh Token
   */
	}, {
		key: 'getRefreshToken',
		value: function getRefreshToken() {
			return BEApi.storage.getItem(this.conf.refreshTokenKey) || undefined;
		}

		/**
   * Retrieve Access Token Expire Date from the storage (@see {@link BEApi.storage}).
   * @return {Date} The Access Token Expire Date
   */
	}, {
		key: 'getAccessTokenExpireDate',
		value: function getAccessTokenExpireDate() {
			var data = BEApi.storage.getItem(this.conf.accessTokenExpireDate);
			if (data) {
				data = parseInt(data);
				return new Date(data);
			}
		}

		/**
   * Check if Access Token is expired
   * @return {Boolean} If token is expired, return `true`, otherwise `false`
   */
	}, {
		key: 'isTokenExpired',
		value: function isTokenExpired() {
			return new Date() >= this.getAccessTokenExpireDate();
		}

		/**
   * Retrieve the storage interface.
   * The storage is used to save access and refresh tokens.
   * By default, the storage interface in the browser is the localStorage {@link https://developer.mozilla.org/it/docs/Web/API/Window/localStorage}
   * while in a Node environment is `node-localstorage` {@link https://www.npmjs.com/package/node-localstorage}
   * @static
   * @return {Object} The storage interface
   */
	}, {
		key: 'defaultConfigKey',
		get: function get() {
			return 'default';
		}

		/**
   * Return the chosen registry configuration key or the default one.
   * @type {String}
   * @default 'default'
   */
	}, {
		key: 'configKey',
		get: function get() {
			return this.conf && this.conf.configKey || this.defaultConfigKey;
		}
	}], [{
		key: 'storage',
		get: function get() {
			if (this._storage) {
				return this._storage;
			}
			if ('object' == typeof module && 'object' == typeof module.exports) {
				var LocalStorage = require('node-localstorage').LocalStorage;
				return BEApi.storage = new LocalStorage('./beapi');
			} else if ('undefined' !== typeof localStorage) {
				return BEApi.storage = window.localStorage;
			}
		},

		/**
   * Set a custom the storage interface.
   * Set an alternative storage interface with the same LocalStorage API (`setItem`, `getItem` and `removeItem`)
   * @static
   */
		set: function set(storage) {
			if (typeof storage['setItem'] === 'function' && typeof storage['getItem'] === 'function' && typeof storage['removeItem'] === 'function') {
				this._storage = storage;
			} else {
				throw 'Invalid custom storage.';
			}
		}

		/**
   * Retrieve the Ajax interface.
   * The Ajax is used to perform XMLHttpRequest requests.
   * By default, the Ajax interface in the browser is the XMLHttpRequest {@link https://developer.mozilla.org/it/docs/Web/API/XMLHttpRequest}
   * while in a Node environment is `xmlhttprequest` {@link https://www.npmjs.com/package/xmlhttprequest}
   * @static
   * @return {Object} The Ajax interface
   */
	}, {
		key: 'xhr',
		get: function get() {
			return BEXhr.xhr;
		},

		/**
   * Set a custom the Ajax interface.
   * Set an alternative Ajax interface compatible with a `jQuery.ajax` like pattern {@link http://api.jquery.com/jquery.ajax/}
   * @static
   */
		set: function set(xhr) {
			BEXhr.xhr = xhr;
		}
	}]);

	return BEApi;
})();
'use strict';

var _bind = Function.prototype.bind;

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var noop = function noop() {};

/**
 * Create a task model to insert into a BEApiQueue.
 * @class
 */

var BEApiQueueTask =

/**
 * Instantiate a BEApiQueueTask Object.
 * @constructor
 * @param {Function} method A BEApiQueue Method class constructor.
 * @param {Array} args The list of arguments to pass to the BEApiQueue Method constructor
 */
function BEApiQueueTask(method) {
	var args = arguments.length <= 1 || arguments[1] === undefined ? [] : arguments[1];

	_classCallCheck(this, BEApiQueueTask);

	var self = this;
	if (method) {
		self.fn = method;
	}
	if (args) {
		self.args = args;
	}
	// instantiate the task local promise
	self.promise = new Promise(function (resolve, reject) {
		self.resolve = resolve;
		self.reject = reject;
	});
}

/**
 * Create a chainable queue of BEApi requests.
 * @class
 */
;

var BEApiQueue = (function () {

	/**
  * Instantiate a BEApiQueue Object.
  * @constructor
  * @param {String|Object|BEApi} conf A set of options or a configuration key for BEApiRegistry.
  */

	function BEApiQueue(conf) {
		_classCallCheck(this, BEApiQueue);

		var that = this;
		if (typeof conf === 'string') {
			// if conf is a string, try to read configuration from BEApiRegistry
			this.conf = BEApiRegistry.getInstance(conf);
		} else if (conf instanceof BEApi) {
			// if conf is a BEApi instance, grab the configuration with `BEApi.getConfiguration` method
			this.conf = conf.getConfiguration();
		} else if (typeof conf === 'object') {
			// if conf is a plain object, use it
			this.conf = conf;
		} else {
			throw 'No BEApi configuration provided.';
		}
		// setup the global promise and resolvers
		this._promise = new Promise(function (resolve, reject) {
			that._resolver = resolve;
			that._rejecter = reject;
		});
		this.reset();
	}

	/**
  * Abstract class for `BEApiQueue Method`s.
  * @class
  */

	/**
  * Reset the queue.
  * @return {BEApiQueue} the instance
  */

	_createClass(BEApiQueue, [{
		key: 'reset',
		value: function reset() {
			this.queue = [];
			return this;
		}

		/**
   * Add a BEApiQueueTask instance to the queue.
   * @param {BEApiQueueTask} task
   * @return {BEApiQueue} the instance
   */
	}, {
		key: 'add',
		value: function add(task) {
			this.queue.push(task);
			return this;
		}

		/**
   * Perform the queue of requests.
   * @return {Promise} the global promise
   */
	}, {
		key: 'exec',
		value: function exec() {
			var self = this,
			    queue = this.queue,
			    beapi = new BEApi(this.conf),
			    scope;

			// let's start the queue!
			_exec(queue);

			function _exec(queue, index) {
				index = index || 0;
				if (index == queue.length) {
					// if iterator reached the end of the queue, resolve the global promise
					return self._resolver(scope);
				}
				var task = queue[index],
				    method = task.fn,
				    args = task.args,
				    resolver = task.resolve,
				    rejecter = task.reject,
				    promise = task.promise,
				    traskInstance = new (_bind.apply(BEApiQueue.tasks[method], [null].concat(_toConsumableArray(args))))();

				// process the input arguments using task instance `input` method
				traskInstance.input.call(traskInstance, scope).then(function (options) {
					// perform the Ajax request using the BEApi instance
					// `done` and `fail` callbacks both will be process by the local `onLoad` function
					var ajaxMethod = traskInstance.type.toLowerCase();
					if (typeof beapi[ajaxMethod] == 'function') {
						beapi[ajaxMethod].apply(beapi, options).then(onLoad, onLoad);
					}
				});

				function onLoad(res) {
					// validate the request result using task instance `validate` method
					traskInstance.validate(res).then(function () {
						// if validation is succeeded, process the result using task instance `transform` method.
						// The `transform` function of a BEApiQueue Method performs some changes to the request result
						// and to the scope object.
						traskInstance.transform(scope, res).then(function (obj) {
							// update the scope
							scope = obj;
							// resolve the task promise
							resolver(scope);
							// execute the next task!
							_exec(queue, index + 1);
						}, function (err) {
							// if transformation fails, reject both task and global promises and stop the queue
							rejecter(scope);
							self._rejecter(err);
						});
					}, function (err) {
						// if validation fails, reject both task and global promises and stop the queue
						rejecter(scope);
						self._rejecter(err);
					});
				}
			}

			return this._promise;
		}

		/**
   * Alias of `BEApiQueue.exec`.
   * @see {@link BEApiQueue.exec}
   */
	}, {
		key: 'get',
		value: function get() {
			return this.exec();
		}

		/**
   * Get the first task in queue.
   * @return {BEApiQueueTask} The first task.
   */
	}, {
		key: 'first',
		value: function first() {
			if (this.queue.length) {
				return this.queue[0];
			}
		}

		/**
   * Get the last task in queue.
   * @return {BEApiQueueTask} The last task.
   */
	}, {
		key: 'last',
		value: function last() {
			if (this.queue.length) {
				return this.queue[this.queue.length - 1];
			}
		}

		/**
   * Alias of the last task in queue `promise.then`.
   * Attach a success and/or fail callback to the last added task.
   * If the queue is empty, the method `BEApiQueue.all` {@link BEApiQueue.all} is called instead.
   * @param {Function} done The success callback [optional].
   * @param {Function} fail The fail callback [optional].
   * @return {Promise} The last task promise or the global promise.
   */
	}, {
		key: 'then',
		value: function then(done, fail) {
			if (this.queue.length) {
				return this.last().promise.then(done || noop, fail || noop);
			} else {
				return this.all(done || noop, fail || noop);
			}
		}

		/**
   * Alias of the global `promise.then`.
   * Attach a success and/or fail callback to the global queue promise.
   * @param {Function} done The success callback [optional].
   * @param {Function} fail The fail callback [optional].
   * @return {Promise} The global promise.
   */
	}, {
		key: 'all',
		value: function all(done, fail) {
			if (this._promise) {
				return this._promise.then(done || noop, fail || noop);
			}
		}

		/**
   * Attach a method to the `BEApiQueue.prototype`.
   * The attached method should be an instance of `BEApiQueueBaseMethod`.
   * @param {String} taskName The name of the function attached to the prototype.
   * @param {BEApiQueueBaseMethod} def The method class.
   */
	}], [{
		key: 'register',
		value: function register(taskName, def) {
			if (taskName && typeof BEApiQueue.prototype[taskName] !== 'undefined') {
				throw 'Reserved method';
			}

			BEApiQueue.tasks = BEApiQueue.tasks || {};
			BEApiQueue.tasks[taskName] = def;

			(function (method) {
				BEApiQueue.prototype[method] = function () {
					for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
						args[_key] = arguments[_key];
					}

					this.add(new BEApiQueueTask(method, args));
					return this;
				};
			})(taskName);
		}
	}]);

	return BEApiQueue;
})();

var BEApiQueueBaseMethod = (function () {
	_createClass(BEApiQueueBaseMethod, [{
		key: 'type',

		/**
   * The HTTP method of the request.
   * @type {String}
   * @default 'get'
   */
		get: function get() {
			return 'get';
		}

		/**
   * Initialize a `BEApiQueue Method`.
   * @constructor
   */
	}]);

	function BEApiQueueBaseMethod() {
		var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

		_classCallCheck(this, BEApiQueueBaseMethod);

		this.options = options;
	}

	/**
  * Arguments input processor.
  * @param {Object} scope The scope for the queue.
  * @param {*} args All the arguments passed to the method when invoked in queue.
  * @return {Promise} A promise resolved when all inputs are processed.
  */

	_createClass(BEApiQueueBaseMethod, [{
		key: 'input',
		value: function input(scope) {
			for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
				args[_key2 - 1] = arguments[_key2];
			}

			return new Promise(function (resolve) {
				resolve(args);
			});
		}

		/**
   * Validate the result of a request response.
   * @param {Object} res The request response.
   * @return {Promise} A promise resolved when the response is validated.
   */
	}, {
		key: 'validate',
		value: function validate(res) {
			return new Promise(function (resolve, reject) {
				if (res && res.data && (!res.status || res.status >= 200 && res.status < 300)) {
					resolve();
				} else {
					reject();
				}
			});
		}

		/**
   * Transform the result of a request response.
   * @param {Object} scope The scope for the queue.
   * @param {Object} res The request response.
   * @return {Promise} A promise resolved when scope changes are finished.
   */
	}, {
		key: 'transform',
		value: function transform(scope, res) {
			return new Promise(function (resolve) {
				resolve(scope);
			});
		}
	}]);

	return BEApiQueueBaseMethod;
})();
'use strict';
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var BEApiQueueIdentity = (function (_BEApiQueueBaseMethod) {
	_inherits(BEApiQueueIdentity, _BEApiQueueBaseMethod);

	function BEApiQueueIdentity(data) {
		_classCallCheck(this, BEApiQueueIdentity);

		_get(Object.getPrototypeOf(BEApiQueueIdentity.prototype), 'constructor', this).call(this, {
			id: data.id,
			data: data
		});
	}

	_createClass(BEApiQueueIdentity, [{
		key: 'validate',
		value: function validate() {
			return new Promise(function (resolve) {
				resolve();
			});
		}
	}, {
		key: 'input',
		value: function input(scope) {
			var self = this;
			return new Promise(function (resolve) {
				resolve([{
					url: '/'
				}]);
			});
		}
	}, {
		key: 'transform',
		value: function transform(scope, res) {
			var self = this;
			return new Promise(function (resolve, reject) {
				resolve(self.options.data);
			});
		}
	}]);

	return BEApiQueueIdentity;
})(BEApiQueueBaseMethod);

BEApiQueue.register('identity', BEApiQueueIdentity);
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var BEApiQueueObjects = (function (_BEApiQueueBaseMethod) {
	_inherits(BEApiQueueObjects, _BEApiQueueBaseMethod);

	function BEApiQueueObjects(id, type) {
		_classCallCheck(this, BEApiQueueObjects);

		_get(Object.getPrototypeOf(BEApiQueueObjects.prototype), 'constructor', this).call(this, {
			id: id,
			type: type
		});
	}

	_createClass(BEApiQueueObjects, [{
		key: 'input',
		value: function input(scope) {
			var self = this;
			return new Promise(function (resolve) {
				resolve([{
					url: (self.options.type ? self.options.type + 's' : 'objects') + (self.options.id ? '/' + self.options.id : '')
				}]);
			});
		}
	}, {
		key: 'transform',
		value: function transform(scope, res) {
			return new Promise(function (resolve, reject) {
				if (res.data.object) {
					scope = res.data.object;
				}
				resolve(scope);
			});
		}
	}]);

	return BEApiQueueObjects;
})(BEApiQueueBaseMethod);

BEApiQueue.register('objects', BEApiQueueObjects);
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x2, _x3, _x4) { var _again = true; _function: while (_again) { var object = _x2, property = _x3, receiver = _x4; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x2 = parent; _x3 = property; _x4 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var BEApiQueuePoster = (function (_BEApiQueueBaseMethod) {
	_inherits(BEApiQueuePoster, _BEApiQueueBaseMethod);

	function BEApiQueuePoster() {
		var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

		_classCallCheck(this, BEApiQueuePoster);

		_get(Object.getPrototypeOf(BEApiQueuePoster.prototype), 'constructor', this).call(this, options);
	}

	_createClass(BEApiQueuePoster, [{
		key: 'input',
		value: function input(scope) {
			var self = this;
			return new Promise(function (resolve) {
				var suffix = '';
				if (self.options) {
					suffix = '?';
					for (var k in self.options) {
						suffix += k + '=' + self.options[k];
					}
				}
				resolve([{
					url: 'poster/' + scope.id + suffix
				}]);
			});
		}
	}, {
		key: 'transform',
		value: function transform(scope, res) {
			var self = this;
			return new Promise(function (resolve, reject) {
				if (res && res.data) {
					scope['poster'] = res.data;
				}
				resolve(scope);
			});
		}
	}]);

	return BEApiQueuePoster;
})(BEApiQueueBaseMethod);

BEApiQueue.register('poster', BEApiQueuePoster);
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var BEApiQueueRelation = (function (_BEApiQueueBaseMethod) {
	_inherits(BEApiQueueRelation, _BEApiQueueBaseMethod);

	function BEApiQueueRelation(relName) {
		_classCallCheck(this, BEApiQueueRelation);

		_get(Object.getPrototypeOf(BEApiQueueRelation.prototype), 'constructor', this).call(this, {
			relName: relName
		});
	}

	_createClass(BEApiQueueRelation, [{
		key: 'input',
		value: function input(scope) {
			var self = this;
			return new Promise(function (resolve) {
				resolve([{
					url: 'objects/' + scope.id + '/relations/' + self.options.relName
				}]);
			});
		}
	}, {
		key: 'transform',
		value: function transform(scope, res) {
			var self = this;
			return new Promise(function (resolve, reject) {
				scope['relations'] = scope['relations'] || {};
				scope['relations'][self.options.relName] = scope['relations'][self.options.relName] || {};
				scope['relations'][self.options.relName].objects = res.data.objects;
				resolve(scope);
			});
		}
	}]);

	return BEApiQueueRelation;
})(BEApiQueueBaseMethod);

BEApiQueue.register('relation', BEApiQueueRelation);

//# sourceMappingURL=beapi.js.map