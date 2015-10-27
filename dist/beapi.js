'use strict';

var _bind = Function.prototype.bind;

var _get = function get(_x17, _x18, _x19) { var _again = true; _function: while (_again) { var object = _x17, property = _x18, receiver = _x19; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x17 = parent; _x18 = property; _x19 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

try {
	console.log("%c❤︎%c BEdita", 'color: red; font-size: 3em', 'color: #000; font-size: 2em; font-family: Georgia');
} catch (ex) {}
//

/**
 * A base model for BE objects.
 * @class
 */

var BEModel = (function () {
	/**
  * Instantiate config properties.
  * @param {Object} conf A configuration set.
  * @constructor
  */

	function BEModel(conf) {
		_classCallCheck(this, BEModel);

		this.__config = conf;
		this.__modified = [];
	}

	/**
  * A base model for BE collections.
  * @class
  */

	/**
  * Get or set configuration params.
  * @param {Object} conf An optional set of configuration params.
  * @return {Object} The current configuration set.
  */

	_createClass(BEModel, [{
		key: '_config',
		value: function _config(conf) {
			if (conf) {
				this.__config = conf;
			}
			return this.__config;
		}

		/**
   * Get a list of fields that need to sync with the server or add e new one.
   * @param {String|Boolean} key An optional field name which needs to be synced. If `false` is passed, the array will be resetted.
   * @return {Array} A list of fields which need to be synced.
   */
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
	}]);

	return BEModel;
})();

var BEArray = (function (_Array) {
	_inherits(BEArray, _Array);

	/**
  * Instantiate items and config properties.
  * @param {Array} items A list of `BEModel` objects.
  * @param {Object} conf A configuration set.
  * @constructor
  */

	function BEArray(items, conf) {
		_classCallCheck(this, BEArray);

		_get(Object.getPrototypeOf(BEArray.prototype), 'constructor', this).call(this, items);
		this.__config = conf;
	}

	/**
  * Get or set configuration params.
  * @param {Object} conf An optional set of configuration params.
  * @return {Object} The current configuration set.
  */

	_createClass(BEArray, [{
		key: '_config',
		value: function _config(conf) {
			if (conf) {
				this.__config = conf;
			}
			return this.__config;
		}

		/**
   * Get a list of fields that need to sync with the server or add e new one.
   * @param {String|Boolean} key An optional field name which needs to be synced. If `false` is passed, the array will be resetted.
   * @return {Array} A list of fields which need to be synced.
   */
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
	}]);

	return BEArray;
})(Array);

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

	/**
  * A generic model for BE objects.
  * @class
  */

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
			var _this = this,
			    _arguments2 = arguments;

			return new Promise(function (resolve, reject) {
				if (_this.url || url) {
					if (_this.alias) {
						return _this.alias.fetch(_this.url || url || undefined);
					}
					_this.splice(0, _this.length);
					var beapi = new BEApi(_this._config());
					beapi.get(_this.url || url).then(function (res) {
						if (res && res.data && res.data.objects) {
							for (var i = 0; i < res.data.objects.length; i++) {
								var obj = res.data.objects[i];
								_this.push(obj);
							}
						}
						resolve.apply(_this, _arguments2);
					}, function (err) {
						reject.apply(_this, _arguments2);
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

var BEObject = (function (_BEModel) {
	_inherits(BEObject, _BEModel);

	/**
  * Set up the model.
  * @see {@link BEModel.constructor}.
  * @param {Object} data The initial data to set.
  * @param {Object} conf An optional set of configuration params.
  * @constructor
  */

	function BEObject(data, conf) {
		if (data === undefined) data = {};

		_classCallCheck(this, BEObject);

		_get(Object.getPrototypeOf(BEObject.prototype), 'constructor', this).call(this, conf);
		this.set(data);
	}

	/**
  * XMLHttpRequest wrapper for the browser.
  * @class
  */

	/**
  * Perform a BEApi request to populate the model.
  * If the current model has not a valid ID or a valid nickname, reject the promise.
  * At the end of the request, automatically set fetched data.
  * @return {Promise}
  */

	_createClass(BEObject, [{
		key: 'fetch',
		value: function fetch() {
			var _this2 = this;

			return new Promise(function (resolve, reject) {
				if (_this2.id || _this2.nickname) {
					var promise = new BEApi(_this2._config()).get('objects/' + (_this2.id || _this2.nickname));
					promise.then(function (res) {
						if (res && res.data && res.data.object) {
							_this2.set(res.data.object);
							_this2._modified(false);
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

		/**
   * Perform a BEApi request to sync the model with the server.
   * If the current model has not a valid ID or a valid nickname, a new object will be created.
   * At the end of the request, automatically set new fetched data.
   * @param {Object} data Optional data to set before save.
   * @return {Promise}
   */
	}, {
		key: 'save',
		value: function save() {
			var _this3 = this;

			var data = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

			this.set(data);
			var dataToSend = this.toJSON(this._modified());
			dataToSend.id = this.id, dataToSend.nickname = this.nickname;
			return new Promise(function (resolve, reject) {
				var promise = new BEApi(_this3._config()).post('objects', {
					data: dataToSend
				});
				promise.then(function (res) {
					if (res && res.data && res.data.object) {
						_this3.set(res.data.object);
						_this3._modified(false);
						resolve(res);
					} else {
						reject(res);
					}
				}, function (err) {
					reject(err);
				});
			});
		}

		/**
   * A {@link BEObject.save} wrapper for object creation.
   * @throws If the model already has a valid ID.
   * @param {Object} data Optional data to set before creation.
   * @return {Promise}
   */
	}, {
		key: 'create',
		value: function create() {
			var data = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

			if (!this.isNew()) {
				throw 'Object already created.';
			}
			return this.save(data);
		}

		/**
   * Perform a BEApi request to delete the object.
   * @throws If the model has not a valid ID or a valid nickname.
   * @return {Promise}
   */
	}, {
		key: 'remove',
		value: function remove() {
			var _this4 = this;

			if (this.isNew()) {
				throw 'Object has not a valid ID or a valid nickname.';
			}
			return new Promise(function (resolve, reject) {
				var promise = new BEApi(_this4._config())['delete']('objects/' + (_this4.id || _this4.nickname));
				promise.then(function (res) {
					resolve();
				}, function (err) {
					reject(err);
				});
			});
		}

		/**
   * Clone the model.
   * @return {BEObject} The clone model.
   */
	}, {
		key: 'clone',
		value: function clone() {
			return new BEObject(this.toJSON([], ['id']), this._config());
		}

		/**
   * Check if the model is new (client-side created).
   * @return {Boolean}
   */
	}, {
		key: 'isNew',
		value: function isNew() {
			return !this.id && !this.nickname;
		}

		/**
   * Set data to the model.
   * Automatically create BECollection for children and relations.* fields.
   * Automatically create a BEObject for the parent if `parent_id` is specified.
   * Automatically convert ISO string dates into {Date} objects.
   * Add to the `__modified` the key that needs to be sync with the server.
   * @param {Object|String} data A set of data to set or a key to update.
   * @param {*} value The value to set to the `data` key string.
   * @return {BEObject} The instance.
   */
	}, {
		key: 'set',
		value: function set(data, value) {
			if (data === undefined) data = {};

			if (value !== undefined && typeof data == 'string') {
				var key = data;
				data = {};
				data[key] = value;
			}
			var relations = data.relations || {};
			var children = data.children || {};
			var isoDateRegex = /\d{4,}\-\d{2,}\-\d{2,}T\d{2,}:\d{2,}:\d{2,}\+\d{4,}/;

			// iterate relations and create BECollection for each key
			for (var k in relations) {
				if (!this.relations) {
					this.relations = {};
				}
				this.relations[k] = new BECollection(relations[k], this._config());
			}

			// create a BECollection for the `children` field
			if (children && !this.children) {
				this.children = new BECollection({
					url: children.url,
					count: children.count
				}, this._config());
				if (children.sections) {
					this.sections = new BECollection({
						alias: this.children,
						filter: {
							object_type: 'Section'
						},
						url: children.sections.url,
						count: children.sections
					}, this._config());
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
				// add to modified list
				if (this[k] !== d) {
					this[k] = d;
					this._modified(k);
				}
			}

			// create a BEObject for the parent if the defined
			if (data.parent_id) {
				this.parent = new BEObject({
					id: data.parent_id
				});
				delete this.parent_id;
			} else {
				delete this.parent;
			}

			return this;
		}

		/**
   * Check if the model match a filter.
   * @param {Object|String|RegExp} filter The filter to use. Could be any dataset, a simple string, or a regular expression.
   * @return {Boolean}
   */
	}, {
		key: 'is',
		value: function is(filter) {
			var data = this.toJSON();
			if (filter instanceof RegExp) {
				for (var k in data) {
					if (data[k].match(filter)) {
						return true;
					}
				}
			} else if (typeof filter == 'string') {
				var regex = new RegExp(filter);
				for (var k in data) {
					if (data[k].match(regex)) {
						return true;
					}
				}
			} else if (typeof filter == 'object') {
				for (var k in filter) {
					if (filter[k] !== data[k]) {
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
			var _this5 = this;

			var queue = new BEApiQueue(this._config());
			if ('id' in this && 'nickname' in this) {
				queue.identity(this);
			} else {
				queue.objects(this.id || this.nickname);
			}
			queue.all(function (scope) {
				_this5.set(scope);
				_this5._modified(false);
			});
			return queue;
		}
	}, {
		key: 'toJSON',
		value: function toJSON(keep, remove) {
			var res = {},
			    data = this;

			if (!Array.isArray(keep)) {
				keep = [];
			}
			if (!Array.isArray(remove)) {
				remove = [];
			}
			for (var k in data) {
				if (BEObject.unsetFromData.indexOf(k) === -1 && typeof data[k] !== 'function' && (!keep || !keep.length || keep.indexOf(k) !== -1) && (!remove || !remove.length || remove.indexOf(k) === -1)) {
					res[k] = data[k];
				}
			}
			return res;
		}
	}], [{
		key: 'unsetFromData',
		get: function get() {
			return ['__modified', '__config'];
		}
	}]);

	return BEObject;
})(BEModel);

var BEXhr = (function () {
	function BEXhr() {
		_classCallCheck(this, BEXhr);
	}

	/**
  * Convenience method to process request arguments
  * - If the argument is String typed, set it as url attribute of a set of options
  * @private
  * @param {String|Object} conf The request arguments.
  * @return {Object} A valid set of options for the request.
  */

	_createClass(BEXhr, null, [{
		key: 'exec',

		/**
   * Perform an Ajax request.
   * Set an alternative Ajax interface compatible with a `XMLHttpRequest` like pattern {@link https://developer.mozilla.org/it/docs/Web/API/XMLHttpRequest}.
   * @static
   * @param {Object} options A set of options for the Ajax request.
   * @return {Promise}
   */
		value: function exec() {
			var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

			var defaults = {
				type: 'GET',
				async: true,
				responseType: 'json',
				headers: {},
				data: undefined
			};
			// extend defaults with options
			var opt = {},
			    merge = [defaults, options];
			for (var i = 0; i < merge.length; i++) {
				var obj = merge[i];
				for (var k in obj) {
					opt[k] = obj[k];
				}
			}
			opt.type = opt.type.toUpperCase();
			// setup a Promise
			return new Promise(function (resolve, reject) {
				// instantiate the Ajax interface (@see {@link BEXhr.xhr})
				var oReq = new BEXhr.xhr();

				// done listener
				oReq.addEventListener('load', function () {
					var data = undefined;
					try {
						data = oReq.response || oReq.responseText || '';
					} catch (ex) {}
					//

					// try to convert JSON data into object
					if (data && data !== '') {
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

				// error listeners
				oReq.addEventListener('error', function () {
					reject(oReq);
				}, false);

				oReq.addEventListener('abort', function () {
					reject(oReq);
				}, false);

				oReq.responseType = opt.responseType;

				// open the request
				oReq.open(opt.type, opt.url, opt.async);
				// set headers
				if (opt.headers && 'object' == typeof opt.headers) {
					for (var k in opt.headers) {
						oReq.setRequestHeader(k, opt.headers[k]);
					}
				}
				if (opt.type == 'POST' || opt.type == 'PUT' && opt.data !== undefined) {
					// if POST or PUT method, send data
					var data = opt.data;
					if ('object' == typeof data) {
						data = JSON.stringify(data);
					}
					oReq.send(data);
				} else {
					// simple request send
					oReq.send();
				}
			});
		}
	}, {
		key: 'xhr',

		/**
   * Retrieve the Ajax interface.
   * The Ajax is used to perform XMLHttpRequest requests.
   * By default, the Ajax interface in the browser is the XMLHttpRequest {@link https://developer.mozilla.org/it/docs/Web/API/XMLHttpRequest}.
   * while in a Node environment is `xmlhttprequest` {@link https://www.npmjs.com/package/xmlhttprequest}.
   * @static
   * @return {Object} The Ajax interface.
   */
		get: function get() {
			if (this._xhr) {
				// return custom Ajax interface if set
				return this._xhr;
			} else {
				// look for node environment
				if ('object' == typeof module && 'object' == typeof module.exports) {
					// return node module
					return this.xhr = require('xmlhttprequest').XMLHttpRequest;
				} else {
					// return browser `XMLHttpRequest`
					return window.XMLHttpRequest;
				}
			}
		},

		/**
   * Set a custom the Ajax interface.
   * Set an alternative Ajax interface compatible with a `XMLHttpRequest` like pattern {@link https://developer.mozilla.org/it/docs/Web/API/XMLHttpRequest}.
   * @static
   * @param {Class} xhr A valid and compatible Ajax interface.
   */
		set: function set(xhr) {
			this._xhr = xhr;
		}
	}]);

	return BEXhr;
})();

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
				throw 'Missing valid `baseUrl`.';
			}
		}

		this.conf = opt;
		// add the current configuration to the BEApiRegistry.
		BEApiRegistry.add(this.configKey, this.conf);
	}

	/**
  * Create a task model to insert into a BEApiQueue.
  * @class
  */

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
			var _this7 = this;

			var opt = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

			if (this.getAccessToken() && this.isTokenExpired()) {
				return new Promise(function (resolve, reject) {
					var doXHR = function doXHR() {
						var _this6 = this,
						    _arguments3 = arguments;

						delete opt.headers['Authorization'];
						opt = this._processOptions(opt);
						BEXhr.exec(opt).then(function () {
							resolve.apply(_this6, _arguments3);
						}, function () {
							reject.apply(_this6, _arguments3);
						});
					};
					_this7.refreshToken().then(doXHR, doXHR);
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
			var storage = BEApi.storage,
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

			return promise.then().then(function (res) {
				if (res && res.data && res.data.logout) {
					storage.removeItem(opt.refreshTokenKey);
				}
			});
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
   * @param {Class} xhr A valid and compatible Ajax interface.
   */
		set: function set(xhr) {
			BEXhr.xhr = xhr;
		}
	}]);

	return BEApi;
})();

var BEApiQueueTask =

/**
 * Instantiate a BEApiQueueTask Object.
 * @constructor
 * @param {Function} method A BEApiQueue Method class constructor.
 * @param {Array} args The list of arguments to pass to the BEApiQueue Method constructor
 */
function BEApiQueueTask(method) {
	var _this8 = this;

	var args = arguments.length <= 1 || arguments[1] === undefined ? [] : arguments[1];

	_classCallCheck(this, BEApiQueueTask);

	if (method) {
		this.fn = method;
	}
	this.args = args;
	// instantiate the task local promise
	this.promise = new Promise(function (resolve, reject) {
		_this8.resolve = resolve;
		_this8.reject = reject;
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
		var _this9 = this;

		_classCallCheck(this, BEApiQueue);

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
			_this9._resolver = resolve;
			_this9._rejecter = reject;
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
			var queue = this.queue,
			    beapi = new BEApi(this.conf),
			    scope = undefined;

			// let's start the queue!
			_exec(this, queue);

			function _exec(self, queue, index) {
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
				    taskClass = BEApiQueue.tasks[method],
				    taskInstance = new (_bind.apply(taskClass, [null].concat(_toConsumableArray(args))))();

				// process the input arguments using task instance `input` method
				taskInstance.input.call(taskInstance, scope).then(function (options) {
					// perform the Ajax request using the BEApi instance
					// `done` and `fail` callbacks both will be process by the local `onLoad` function
					var ajaxMethod = taskInstance.type.toLowerCase();
					if (typeof beapi[ajaxMethod] == 'function') {
						var loadCompletePromise = beapi[ajaxMethod].apply(beapi, options).then();
						loadCompletePromise.then(function (res) {
							// validate the request result using task instance `validate` method
							taskInstance.validate(res).then(function () {
								// if validation is succeeded, process the result using task instance `transform` method.
								// The `transform` function of a BEApiQueue Method performs some changes to the request result
								// and to the scope object.
								taskInstance.transform(scope, res).then(function (obj) {
									// update the scope
									scope = obj;
									// resolve the task promise
									resolver(scope);
									// execute the next task!
									_exec(self, queue, index + 1);
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
						});
					}
				});
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
				return this.last().promise.then(done || BEApiQueue.__noop, fail || BEApiQueue.__noop);
			} else {
				return this.all(done || BEApiQueue.__noop, fail || BEApiQueue.__noop);
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
				return this._promise.then(done || BEApiQueue.__noop, fail || BEApiQueue.__noop);
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
					for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
						args[_key2] = arguments[_key2];
					}

					this.add(new BEApiQueueTask(method, args));
					return this;
				};
			})(taskName);
		}
	}, {
		key: '__noop',
		value: function __noop() {}
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
			for (var _len3 = arguments.length, args = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
				args[_key3 - 1] = arguments[_key3];
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
			return new Promise(function (resolve) {
				resolve([{
					url: '/'
				}]);
			});
		}
	}, {
		key: 'transform',
		value: function transform(scope, res) {
			var _this10 = this;

			return new Promise(function (resolve, reject) {
				resolve(_this10.options.data);
			});
		}
	}]);

	return BEApiQueueIdentity;
})(BEApiQueueBaseMethod);

BEApiQueue.register('identity', BEApiQueueIdentity);

var BEApiQueueObjects = (function (_BEApiQueueBaseMethod2) {
	_inherits(BEApiQueueObjects, _BEApiQueueBaseMethod2);

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
			var _this11 = this;

			return new Promise(function (resolve) {
				resolve([{
					url: (_this11.options.type ? _this11.options.type + 's' : 'objects') + (_this11.options.id ? '/' + _this11.options.id : '')
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

var BEApiQueuePoster = (function (_BEApiQueueBaseMethod3) {
	_inherits(BEApiQueuePoster, _BEApiQueueBaseMethod3);

	function BEApiQueuePoster() {
		var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

		_classCallCheck(this, BEApiQueuePoster);

		_get(Object.getPrototypeOf(BEApiQueuePoster.prototype), 'constructor', this).call(this, options);
	}

	_createClass(BEApiQueuePoster, [{
		key: 'input',
		value: function input(scope) {
			var _this12 = this;

			return new Promise(function (resolve) {
				var suffix = '';
				if (_this12.options) {
					suffix = '?';
					for (var k in _this12.options) {
						suffix += k + '=' + _this12.options[k];
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

var BEApiQueueRelation = (function (_BEApiQueueBaseMethod4) {
	_inherits(BEApiQueueRelation, _BEApiQueueBaseMethod4);

	function BEApiQueueRelation(relName) {
		_classCallCheck(this, BEApiQueueRelation);

		_get(Object.getPrototypeOf(BEApiQueueRelation.prototype), 'constructor', this).call(this, {
			relName: relName
		});
	}

	_createClass(BEApiQueueRelation, [{
		key: 'input',
		value: function input(scope) {
			var _this13 = this;

			return new Promise(function (resolve) {
				resolve([{
					url: 'objects/' + scope.id + '/relations/' + _this13.options.relName
				}]);
			});
		}
	}, {
		key: 'transform',
		value: function transform(scope, res) {
			var _this14 = this;

			return new Promise(function (resolve, reject) {
				scope['relations'] = scope['relations'] || {};
				scope['relations'][_this14.options.relName] = scope['relations'][_this14.options.relName] || {};
				scope['relations'][_this14.options.relName].objects = res.data.objects;
				resolve(scope);
			});
		}
	}]);

	return BEApiQueueRelation;
})(BEApiQueueBaseMethod);

BEApiQueue.register('relation', BEApiQueueRelation);

//# sourceMappingURL=beapi.js.map
//# sourceMappingURL=beapi.js.map
