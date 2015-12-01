'use strict';

var _bind = Function.prototype.bind;

var _get = function get(_x22, _x23, _x24) { var _again = true; _function: while (_again) { var object = _x22, property = _x23, receiver = _x24; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x22 = parent; _x23 = property; _x24 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

try {
	var heartStyle = 'color: red; font-size: 3em;',
	    logoStyle = 'color: black; font-size: 2em; font-family: Georgia;';
	console.log("%c" + String.fromCharCode(10084) + "%c BEdita", heartStyle, logoStyle);
} catch (ex) {}
//

/**
 * @class BEModel
 * @classdesc A base model for BE objects.
 *
 * @description Instantiate config properties.
 * @param {Object} conf A configuration set.
 */

var BEModel = (function () {
	function BEModel() {
		var conf = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

		_classCallCheck(this, BEModel);

		this.$udid = BEModel.uid();
		this.$modified = [];
		this.$config = conf;
	}

	/**
  * @class BEArray
  * @classdesc A base model for BE collections.
  *
  * @description Instantiate items and config properties.
  * @param {Array} items A list of `BEModel` objects.
  * @param {Object} conf A configuration set.
  */

	/**
  * Get the client registry ID.
  * @return {String|Number} The client registry ID.
  */

	_createClass(BEModel, [{
		key: '$id',
		value: function $id() {
			return this.$udid;
		}

		/**
   * Returns a plain javascript object with the model data.
   * @return {Object}
   */
	}, {
		key: '$toJSON',
		value: function $toJSON(keep, remove) {
			var res = {},
			    data = this;

			if (!Array.isArray(keep)) {
				keep = [];
			}
			if (!Array.isArray(remove)) {
				remove = [];
			}
			for (var k in data) {
				if (k[0] !== '$') {
					if ((!keep || keep.length == 0 || keep.indexOf(k) !== -1) && (!remove || remove.length == 0 || remove.indexOf(k) == -1)) {
						res[k] = data[k];
					}
				}
			}
			return res;
		}

		/**
      * Add a callbacks for the specified trigger.
      *
      * @param {String} name The event name
      * @param {Function} callback The callback function
      * @return {Function} Destroy created listener with this function
      */
	}, {
		key: '$on',
		value: function $on(name, callback) {
			var obj = this;
			if (typeof callback == 'function') {
				var objCallbacks = this.$callbacks = this.$callbacks || {};
				var evtCallbacks = objCallbacks[name] = objCallbacks[name] || { 'length': 0 };
				var len = evtCallbacks.length;
				evtCallbacks[len] = {
					fn: callback,
					destroy: (function (callbacks, id) {
						return function () {
							if (typeof callbacks[id] !== undefined) {
								delete callbacks[id];
							}
						};
					}).bind(this)(objCallbacks[name], len)
				};
				evtCallbacks.length += 1;
				return this.$callbacks[name][len].destroy;
			}
		}

		/**
      * Remove all listeners.
      *
      * @param {String} name Optional event name to reset
      */
	}, {
		key: '$off',
		value: function $off(name) {
			var callbacks = this.$callbacks;
			if (callbacks && name && callbacks[name]) {
				var clbs = callbacks[name];
				for (var i in clbs) {
					if (typeof clbs[i] === 'object' && typeof clbs[i].destroy === 'function') {
						clbs[i].destroy.call(this);
					}
				}
			} else {
				this.$callbacks = {};
			}
		}

		/**
      * Trigger a callback.
      *
      * @param {*} obj The object that triggers events
      * @param {String} name Event name
      * @param {Array} ...args Arguments to pass to callback functions
      * @exec callback functions
      */
	}, {
		key: '$trigger',
		value: function $trigger(name) {
			var objCallbacks = this.$callbacks || {};
			var evtCallbacks = objCallbacks[name] || {};

			for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
				args[_key - 1] = arguments[_key];
			}

			for (var k in evtCallbacks) {
				var clb = evtCallbacks[k];
				if (typeof clb === 'object' && typeof clb.fn === 'function') {
					clb.fn.apply(this, args);
				}
			}
		}

		/**
   * Generate an unique id.
   * @static
   * @return {String|Number} An unique id.
   */
	}], [{
		key: 'uid',
		value: function uid() {
			this.__generated = this.__generated || 0;
			var id = '$' + this.__generated;
			this.__generated += 1;
			return id;
		}
	}]);

	return BEModel;
})();

var BEArray = (function (_Array) {
	_inherits(BEArray, _Array);

	function BEArray() {
		var items = arguments.length <= 0 || arguments[0] === undefined ? [] : arguments[0];
		var conf = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

		_classCallCheck(this, BEArray);

		_get(Object.getPrototypeOf(BEArray.prototype), 'constructor', this).call(this, items);
		this.$udid = BEModel.uid();
		this.$config = conf;
	}

	/**
  * @class BECollection
  * @classdesc A generic model for BE collections.
  *
  * @description Instantiate a BECollection Array.
  * @param {String|Array|Object} data If `String` case, it's the endpoint to fetch. If `Array`, it's the initial state of the collection. If `Object`, it's an object with `<array>items` and `<number>count` fields (in case of pagination).
  * @param {Object} conf An optional set of BEApi configuration params.
  */

	/**
     * Add a callbacks for the specified trigger.
     *
     * @param {String} name The event name
     * @param {Function} callback The callback function
     * @return {Function} Destroy created listener with this function
     */

	_createClass(BEArray, [{
		key: '$on',
		value: function $on(name, callback) {
			return BEModel.prototype.$on.call(this);
		}

		/**
      * Remove all listeners.
      *
      * @param {String} name Optional event name to reset
      */
	}, {
		key: '$off',
		value: function $off() {
			var name = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];

			return BEModel.prototype.$off.call(this);
		}

		/**
      * Trigger a callback.
      *
      * @param {*} obj The object that triggers events
      * @param {String} name Event name
      * @param {Array} ...args Arguments to pass to callback functions
      * @exec callback functions
      */
	}, {
		key: '$trigger',
		value: function $trigger(name) {
			return BEModel.prototype.$trigger.call(this);
		}

		/**
   * Get the client registry ID.
   * @return {String|Number} The client registry ID.
   */
	}, {
		key: '$id',
		value: function $id() {
			return BEModel.prototype.$id.call(this);
		}
	}]);

	return BEArray;
})(Array);

var BECollection = (function (_BEArray) {
	_inherits(BECollection, _BEArray);

	function BECollection() {
		var _this = this;

		var data = arguments.length <= 0 || arguments[0] === undefined ? [] : arguments[0];
		var conf = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

		_classCallCheck(this, BECollection);

		var items = [];
		if (typeof items == 'object') {
			items = data.items || [];
		} else if (Array.isArray(data)) {
			items = data;
		}
		for (var i = 0; i < items.length; i++) {
			if (!(items[i] instanceof BEObject)) {
				items[i] = new BEObject(items[i], conf);
			}
		}
		_get(Object.getPrototypeOf(BECollection.prototype), 'constructor', this).call(this, items, conf);
		if (typeof data == 'string') {
			this.$url = data;
		} else if (typeof items == 'object' && data.count) {
			if (items.length < data.count) {
				this.push(new BEObject({}, conf));
			}
		}
		this.forEach(function (obj) {
			var collections = obj.$collections || [];
			collections.push(_this);
			obj.$collections = collections;
		});
	}

	/**
  * @class BEObject
  * @classdesc A generic model for BE objects.
  *
  * @description Set up the model.
  * see {@link BEModel.constructor}.
  * @param {Object} data The initial data to set.
  * @param {Object} conf An optional set of configuration params.
  */

	/**
  * Extend `Array.prototype.push`. Same input/output. Automatically transform plain objects in BEObject instances.
  * (see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/push})
  */

	_createClass(BECollection, [{
		key: 'push',
		value: function push() {
			var _this2 = this;

			var added = [];

			for (var _len2 = arguments.length, objects = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
				objects[_key2] = arguments[_key2];
			}

			objects.forEach(function (obj) {
				if (!(obj instanceof BEObject)) {
					obj = new BEObject(obj, _this2.$config);
				}
				if (_this2.indexOf(obj) == -1) {
					_this2.__addCollectionToObject(obj);
					added.push(obj);
					Array.prototype.push.call(_this2, obj);
				}
			});
			if (added.length) {
				added.forEach(function (obj) {
					_this2.$trigger('child:added', obj);
				});
				this.$trigger('added', added);
			}
			return this.length;
		}

		/**
   * Extend `Array.prototype.pop`. Same input/output.
   * (see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/pop})
   */
	}, {
		key: 'pop',
		value: function pop() {
			for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
				args[_key3] = arguments[_key3];
			}

			var obj = Array.prototype.pop.apply(this, args);
			if (obj) {
				this.__removeCollectionFromObject(obj);
				this.$trigger('child:removed', obj);
				this.$trigger('removed', [obj]);
			}
			return obj;
		}

		/**
   * Extend `Array.prototype.shift`. Same input/output.
   * (see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/shift})
   */
	}, {
		key: 'shift',
		value: function shift() {
			for (var _len4 = arguments.length, args = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
				args[_key4] = arguments[_key4];
			}

			var obj = Array.prototype.shift.apply(this, args);
			if (obj) {
				this.__removeCollectionFromObject(obj);
				this.$trigger('child:removed', obj);
				this.$trigger('removed', [obj]);
			}
			return obj;
		}

		/**
   * Extend `Array.prototype.splice`. Same input/output.
   * (see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/shift})
   */
	}, {
		key: 'splice',
		value: function splice() {
			var _this3 = this;

			for (var _len5 = arguments.length, args = Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
				args[_key5] = arguments[_key5];
			}

			var removed = Array.prototype.splice.apply(this, args);
			if (removed) {
				removed.forEach(function (obj) {
					_this3.__removeCollectionFromObject(obj);
					_this3.$trigger('child:removed', obj);
				});
				this.$trigger('removed', removed);
			}
			return removed;
		}

		/**
   * Create a relation between the BECollection and its BEObject.
   * @private
   * @param {BEObject} obj The model to associate.
   * @return {Boolean} The relation has been created.
   */
	}, {
		key: '__addCollectionToObject',
		value: function __addCollectionToObject(obj) {
			var collections = obj.$collections || [];
			var io = collections.indexOf(this);
			if (io == -1) {
				collections.push(this);
				obj.$collections = collections;
				return true;
			}
			return false;
		}

		/**
   * Remove a relation between the BECollection and its BEObject.
   * @private
   * @param {BEObject} obj The model to unassociate.
   * @return {Boolean} The relation has been removed.
   */
	}, {
		key: '__removeCollectionFromObject',
		value: function __removeCollectionFromObject(obj) {
			var collections = obj.$collections || [];
			var io = collections.indexOf(this);
			if (io !== -1) {
				collections.splice(io, 1);
				obj.$collections = collections;
				return true;
			}
			return false;
		}

		/**
   * Perform a BEApi request to populate the collection.
   * If the current model has not a valid url, reject the promise.
   * At the end of the request, automatically set fetched items.
   * @param {String} url The endpoint to fetch.
   * @return {Promise}
   */
	}, {
		key: '$fetch',
		value: function $fetch(url) {
			var _this4 = this,
			    _arguments2 = arguments;

			return new Promise(function (resolve, reject) {
				if (_this4.$url || url) {
					(function () {
						if (url) {
							_this4.$url = url;
						}
						var ids = _this4.map(function (obj) {
							return obj.id || obj.$id();
						});
						var beapi = new BEApi(_this4.$config);
						beapi.get(_this4.$url).then(function (res) {
							if (res && res.data && res.data.objects) {
								for (var i = 0; i < res.data.objects.length; i++) {
									var obj = res.data.objects[i];
									var io = ids.indexOf(obj.id);
									if (io !== -1) {
										_this4[io].$set(obj);
									} else {
										_this4.push(obj);
									}
								}
							}
							resolve.apply(_this4, _arguments2);
						}, function (err) {
							reject.apply(_this4, _arguments2);
						});
					})();
				} else {
					reject();
				}
			});
		}

		/**
   * Perform a filter on a BECollection.
   * @param {Object} filter A plain object to match.
   * @return {Array}
   */
	}, {
		key: '$filter',
		value: function $filter(filter) {
			return Array.prototype.filter.call(this, function (item) {
				return item.$is(filter);
			});
		}

		/**
   * Convert a BECollection into a plain array.
   * @return {Array}
   */
	}, {
		key: '$toArray',
		value: function $toArray() {
			return Array.prototype.slice.call(this, 0);
		}
	}]);

	return BECollection;
})(BEArray);

var BEObject = (function (_BEModel) {
	_inherits(BEObject, _BEModel);

	function BEObject(data, conf) {
		if (data === undefined) data = {};

		_classCallCheck(this, BEObject);

		_get(Object.getPrototypeOf(BEObject.prototype), 'constructor', this).call(this, conf);
		this.$collections = [];
		this.$set(data);
	}

	/**
  * @class BEXhr
  * @classdesc XMLHttpRequest wrapper for the browser.
  */

	/**
  * Perform a BEApi request to populate the model.
  * If the current model has not a valid ID or a valid nickname, reject the promise.
  * At the end of the request, automatically set fetched data.
  * @return {Promise}
  */

	_createClass(BEObject, [{
		key: '$fetch',
		value: function $fetch() {
			var _this5 = this;

			return new Promise(function (resolve, reject) {
				if (_this5.id || _this5.nickname) {
					var promise = new BEApi(_this5.$config).get('objects/' + (_this5.id || _this5.nickname));
					promise.then(function (res) {
						if (res && res.data && res.data.object) {
							_this5.$set(res.data.object);
							_this5.$modified = [];
							resolve(res);
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
   * @param {Boolean} force Force request if there are not data to update.
   * @return {Promise}
   */
	}, {
		key: '$save',
		value: function $save() {
			var _this6 = this;

			var data = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
			var force = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

			this.$set(data);
			var modified = this.$modified || [],
			    dataToSend = this.$toJSON(modified);
			dataToSend.id = this.id, dataToSend.nickname = this.nickname;
			return new Promise(function (resolve, reject) {
				if (!force && modified.length == 0) {
					return resolve(_this6.$toJSON());
				}
				var promise = new BEApi(_this6.$config).post('objects', {
					data: dataToSend
				});
				promise.then(function (res) {
					if (res && res.data && res.data.object) {
						_this6.$set(res.data.object);
						_this6.$modified = [];
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
		key: '$create',
		value: function $create() {
			var data = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

			if (!this.$isNew()) {
				throw 'Object already created.';
			}
			return this.$save(data);
		}

		/**
   * Perform a BEApi request to delete the object.
   * @throws If the model has not a valid ID or a valid nickname.
   * @return {Promise}
   */
	}, {
		key: '$remove',
		value: function $remove() {
			var _this7 = this;

			var promise = new Promise(function (resolve, reject) {
				if (!_this7.$isNew()) {
					var _promise = new BEApi(_this7.$config)['delete']('objects/' + (_this7.id || _this7.nickname));
					_promise.then(function (res) {
						resolve();
					}, function (err) {
						reject(err);
					});
				} else {
					resolve();
				}
			});

			promise.then(function () {
				var collections = _this7.$collections;
				collections.forEach(function (collection) {
					var io = collection.indexOf(_this7);
					if (io !== -1) {
						collection.splice(io, 1);
					}
				});
				BEModel.prototype.$remove.call(_this7);
			});

			return promise;
		}

		/**
   * Clone the model.
   * @return {BEObject} The clone model.
   */
	}, {
		key: '$clone',
		value: function $clone() {
			return new BEObject(this.$toJSON([], ['id']), this.$config);
		}

		/**
   * Check if the model is new (client-side created).
   * @return {Boolean}
   */
	}, {
		key: '$isNew',
		value: function $isNew() {
			return !this.id && !this.nickname;
		}

		/**
   * Set data to the model.
   * Automatically create BECollection for children and relations.* fields.
   * Automatically create a BEObject for the parent if `parent_id` is specified.
   * Automatically convert ISO string dates into {Date} objects.
   * Add to the `_modified` the key that needs to be sync with the server.
   * @param {Object|String} data A set of data to set or a key to update.
   * @param {*} value The value to set to the `data` key string.
   * @return {BEObject} The instance.
   */
	}, {
		key: '$set',
		value: function $set(data, value) {
			var _this8 = this;

			if (data === undefined) data = {};

			var before = this.$toJSON();
			if (value !== undefined && typeof data == 'string') {
				var key = data;
				data = {};
				data[key] = value;
			}
			var relations = data.relations;
			var children = data.children;
			var isoDateRegex = /\d{4,}\-\d{2,}\-\d{2,}T\d{2,}:\d{2,}:\d{2,}\+(\d{4,}|\d{2,}\:\d{2,})/;
			// iterate relations and create BECollection for each key
			if (relations) {
				for (var k in relations) {
					if (!this.relations) {
						this.relations = {};
					}
					this.relations[k] = new BECollection(relations[k], this.$config);
					this.$trigger('changed:relation:' + k, this.relations[k]);
				}
				this.$trigger('changed:relations', this.relations);
				delete data.relations;
			}

			// create a BECollection for the `children` field
			if (children && !this.children) {
				this.children = new BECollection(children.url, this.$config);
				this.$trigger('changed:children', this.children);
				if (children.sections) {
					this.sections = new BECollection(children.sections.url, this.$config);
					this.$trigger('changed:sections', this.sections);
				}
				if (children.contents) {
					this.contents = new BECollection(children.contents.url, this.$config);
					this.$trigger('changed:contents', this.contents);
				}
				delete data.children;
			}

			// create a BEObject for the parent if the defined
			if (data.parent_id) {
				this.parent = new BEObject({
					id: data.parent_id
				}, this.$config);
				this.$trigger('changed:parent', this.parent);
				delete this.parent_id;
			} else {
				delete this.parent;
			}

			this.$modified = this.$modified || [];
			var changed = false;
			for (var k in data) {
				var d = data[k];
				//check if iso date
				if (typeof d == 'string' && isoDateRegex.test(d)) {
					var convert = new Date(d);
					if (!isNaN(convert.valueOf())) {
						d = convert;
					}
				}
				// add to modified list
				if (this[k] !== d) {
					var oldVal = this[k];
					this[k] = d;
					if (this.$modified.indexOf(k) == -1) {
						this.$modified.push(k);
						changed = true;
					}
					this.$trigger('changed:' + k, this[d], oldVal);
				}
			}
			if (changed) {
				this.$trigger('changed', this.$toJSON(), before);
				(this.$collections || []).forEach(function (collection) {
					collection.trigger('child:updated', _this8);
				});
			}
			return this;
		}

		/**
   * Check if the model match a filter.
   * @param {Object|String|RegExp} filter The filter to use. Could be any dataset, a simple string, or a regular expression.
   * @return {Boolean}
   */
	}, {
		key: '$is',
		value: function $is(filter) {
			var data = this.$toJSON();
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

		/**
   * Start a query thread for the current Object instance.
   * @return {BEApiQueue} A `BEApiQueue` instance scoped with the current Object.
   */
	}, {
		key: '$query',
		value: function $query() {
			var _this9 = this;

			var queue = new BEApiQueue(this.$config);
			if ('id' in this && 'nickname' in this) {
				queue.identity(this);
			} else {
				queue.objects(this.id || this.nickname);
			}
			queue.all(function (scope) {
				_this9.$set(scope);
				_this9.$modified = [];
			});
			return queue;
		}
	}]);

	return BEObject;
})(BEModel);

var BEXhr = (function () {
	function BEXhr() {
		_classCallCheck(this, BEXhr);
	}

	/**
  * @class BEApiRegistry
  * @classdesc A registry of BEApi configuration.
  * Everywhere, in your JavaScript application, you can use `BEApiRegistry.get(key)` to retrieve a BEApi configration.
  * Register BEApi configurations is lighter and simpler than register instances.
  * Use BEApiRegistry to share configuration between models, interfaces and queues.
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
				// instantiate the Ajax interface (see {@link BEXhr.xhr})
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
   * @private
   * @param {Class} xhr A valid and compatible Ajax interface.
   */
		set: function set(xhr) {
			this._xhr = xhr;
		}
	}]);

	return BEXhr;
})();

var BEApiRegistry = (function () {
	function BEApiRegistry() {
		_classCallCheck(this, BEApiRegistry);
	}

	/**
  * Convenience method to process request arguments
  * - If the argument is String typed, set it as url attribute of a set of options
  * @private
  * @param {String|Object} conf The request arguments.
  * @return {Object} A valid set of options for the request.
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
		key: 'get',
		value: function get(key) {
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

	for (var _len6 = arguments.length, args = Array(_len6 > 1 ? _len6 - 1 : 0), _key6 = 1; _key6 < _len6; _key6++) {
		args[_key6 - 1] = arguments[_key6];
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
 * @class BEApi
 * @classdesc Create an interface to communicate with a BEdita API frontend.
 *
 * @description Instantiate a BEApi Object.
 * @param {Object} conf A set of options.
 */

var BEApi = (function () {
	function BEApi() {
		var conf = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

		_classCallCheck(this, BEApi);

		if (typeof conf == 'string') {
			var opt = BEApiRegistry.get(conf);
			if (opt) {
				conf = opt;
			} else {
				conf = {};
			}
		}
		// if the base url is not provided, try to extract it from the `window.location`.
		if (!conf.baseUrl) {
			try {
				conf.baseUrl = window.location.protocol + '//' + window.location.hostname + (window.location.port ? ':' + window.location.port : '') + '/api/latest/';
			} catch (ex) {
				throw 'Missing valid `baseUrl`.';
			}
		}
		this.conf = conf;
		// add the current configuration to the BEApiRegistry.
		BEApiRegistry.add(this.configKey, conf);
	}

	/**
  * @class BEApiQueue
  * @classdesc Create a chainable queue of BEApi requests.
  *
  * @description Instantiate a BEApiQueue Object.
  * @param {String|Object|BEApi} conf A set of options or a configuration key for BEApiRegistry.
  */

	/**
  * A set of options.
  * @type {Object}
  * @property {String} baseUrl 				The base frontend endpoint.
  * @property {String} configKey 			The registry key to use to store this BEApi configuration (see {@link BEApiRegistry}).
  * @property {String} accessTokenKey 		The storage key to use for Access Token when using auth methods.
  * @property {String} refreshTokenKey		The storage key to use for Refresh Token when using auth methods.
  * @property {String} accessTokenExpireDate The storage key to use for Access Token Expire Date when using auth methods.
  */

	_createClass(BEApi, [{
		key: '_processOptions',

		/**
   * Process and return a complete set of options for the Ajax request.
   * - Automatically set the authorization headers
   * - Automatically set the frontend base url when a not full url is passed
   * @private
   * @param {Object} options A set of options to pass to the Ajax request.
   * @return {Object} A complete set of options.
   */
		value: function _processOptions(options) {
			var opt = _extend({}, options);
			var res = _extend({}, this.conf);
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
			res.skipRefreshToken = res.skipRefreshToken || false;

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
			var _this10 = this;

			var opt = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

			if (this.getAccessToken() && this.isTokenExpired() && !opt.skipRefreshToken) {
				return new Promise(function (resolve, reject) {
					var refreshCompletePromise = _this10.refreshToken().then();
					refreshCompletePromise.then(function () {
						delete opt.headers['Authorization'];
						opt = _this10._processOptions(opt);
						BEXhr.exec(opt).then(function (res) {
							resolve(res);
						}, function (xhr) {
							reject(xhr);
						});
					});
				});
			} else {
				return BEXhr.exec(opt);
			}
		}

		/**
   * Perform the Ajax request for Authentication.
   * - Automatically store Access Token, Refresh Token and Expire Date to the storage (see {@link BEApi#storage}).
   * @private
   * @param {Object} opt A complete set of options to pass to the Ajax request.
   * @return {Promise} The Ajax request Promise.
   */
	}, {
		key: '_processAuth',
		value: function _processAuth() {
			var opt = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

			opt = _extend({}, opt);
			opt.url = 'auth';
			opt.skipRefreshToken = true;
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
   * Convenience method to obtain or set the BEdita API frontend base url.
   * @param {String} url The url to set (optional).
   * @return {Object} The BEdita API frontend base url.
   */
	}, {
		key: 'baseUrl',
		value: function baseUrl(url) {
			if (url) {
				this.conf.baseUrl = url;
			}
			return this.conf.baseUrl;
		}

		/**
   * Perform an API GET request.
   * - Automatically set `GET` as request method.
   * - Use {@link _processOptions} and {@link _processXHR}
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
   * - Use {@link _processOptions} and {@link _processXHR}
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
   * - Use {@link _processOptions} and {@link _processXHR}
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
   * - Use {@link _processOptions} and {@link _processXHR}
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
   * - Automatically store Access Token to the storage (see {@link BEApi#storage}).
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
   * - Retrieve Access Token from the storage (see {@link BEApi#storage}).
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
   * - Remove all BEApi data from the storage (see {@link BEApi#storage}).
   * @return {Promise} The Ajax request Promise.
   */
	}, {
		key: 'logout',
		value: function logout() {
			var storage = BEApi.storage,
			    opt = this.conf,
			    promise = this['delete']({
				url: 'auth/' + this.getRefreshToken(),
				skipRefreshToken: true
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
   * Retrieve Access Token from the storage (see {@link BEApi#storage}).
   * @return {String} The Access Token
   */
	}, {
		key: 'getAccessToken',
		value: function getAccessToken() {
			return BEApi.storage.getItem(this.conf.accessTokenKey) || undefined;
		}

		/**
   * Retrieve Refresh Token from the storage (see {@link BEApi#storage}).
   * @return {String} The Refresh Token
   */
	}, {
		key: 'getRefreshToken',
		value: function getRefreshToken() {
			return BEApi.storage.getItem(this.conf.refreshTokenKey) || undefined;
		}

		/**
   * Retrieve Access Token Expire Date from the storage (see {@link BEApi#storage}).
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
		key: 'conf',
		get: function get() {
			return this._conf;
		},

		/**
   * Setter for configuration object.
   * @private
   * @param {Object} conf A set of options.
   */
		set: function set(conf) {
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

			this._conf = opt;
		}

		/**
   * The default register configuration key.
   * @private
   * @type {String}
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
   * @private
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
   * @private
   * @param {Class} xhr A valid and compatible Ajax interface.
   */
		set: function set(xhr) {
			BEXhr.xhr = xhr;
		}
	}]);

	return BEApi;
})();

var BEApiQueue = (function () {
	function BEApiQueue(conf) {
		var _this11 = this;

		_classCallCheck(this, BEApiQueue);

		if (typeof conf === 'string') {
			// if conf is a string, try to read configuration from BEApiRegistry
			this.conf = BEApiRegistry.get(conf);
		} else if (conf instanceof BEApi) {
			// if conf is a BEApi instance, grab the configuration with `BEApi.conf` property
			this.conf = conf.conf;
		} else if (typeof conf === 'object') {
			// if conf is a plain object, use it
			this.conf = conf;
		} else {
			throw 'No BEApi configuration provided.';
		}
		// setup the global promise and resolvers
		this._promise = new Promise(function (resolve, reject) {
			_this11._resolver = resolve;
			_this11._rejecter = reject;
		});
		this.reset();
	}

	/**
  * @class BEApiQueueTask
  * @classdesc Create a task model to insert into a BEApiQueue.
  *
  * @description Instantiate a BEApiQueueTask Object.
  * @param {Function} method A BEApiQueue Method class constructor.
  * @param {Array} args The list of arguments to pass to the BEApiQueue Method constructor
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
   * see {@link BEApiQueue#exec}
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
   * If the queue is empty, the method `BEApiQueue.all` {@link BEApiQueue#all} is called instead.
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
					for (var _len7 = arguments.length, args = Array(_len7), _key7 = 0; _key7 < _len7; _key7++) {
						args[_key7] = arguments[_key7];
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

var BEApiQueueTask = function BEApiQueueTask(method) {
	var _this12 = this;

	var args = arguments.length <= 1 || arguments[1] === undefined ? [] : arguments[1];

	_classCallCheck(this, BEApiQueueTask);

	if (method) {
		this.fn = method;
	}
	this.args = args;
	// instantiate the task local promise
	this.promise = new Promise(function (resolve, reject) {
		_this12.resolve = resolve;
		_this12.reject = reject;
	});
}

/**
 * @class BEApiQueueBaseMethod
 * @classdesc Abstract class for `BEApiQueue Method`s.
 *
 * @description Initialize a `BEApiQueue Method`.
 */
;

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
			for (var _len8 = arguments.length, args = Array(_len8 > 1 ? _len8 - 1 : 0), _key8 = 1; _key8 < _len8; _key8++) {
				args[_key8 - 1] = arguments[_key8];
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
			var _this13 = this;

			return new Promise(function (resolve, reject) {
				resolve(_this13.options.data);
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
			var _this14 = this;

			return new Promise(function (resolve) {
				resolve([{
					url: (_this14.options.type ? _this14.options.type + 's' : 'objects') + (_this14.options.id ? '/' + _this14.options.id : '')
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

var BEApiQueuePosters = (function (_BEApiQueueBaseMethod3) {
	_inherits(BEApiQueuePosters, _BEApiQueueBaseMethod3);

	function BEApiQueuePosters() {
		var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

		_classCallCheck(this, BEApiQueuePosters);

		_get(Object.getPrototypeOf(BEApiQueuePosters.prototype), 'constructor', this).call(this, options);
	}

	_createClass(BEApiQueuePosters, [{
		key: 'input',
		value: function input(scope) {
			var _this15 = this;

			return new Promise(function (resolve, reject) {
				var suffix = '';
				if (_this15.options) {
					for (var k in _this15.options) {
						suffix = suffix || '?';
						suffix += k + '=' + _this15.options[k];
					}
				}
				if (!Array.isArray(scope)) {
					resolve([{
						url: 'posters/' + scope.id + suffix
					}]);
				} else {
					var ids = scope.map(function (obj) {
						return obj.id;
					});
					var oldSuffix = suffix;
					suffix = '?id=' + ids.join(',');
					if (oldSuffix) {
						suffix += '&' + oldSuffix.substring(1, oldSuffix.length);
					}
					resolve([{
						url: 'posters' + suffix
					}]);
				}
			});
		}
	}, {
		key: 'transform',
		value: function transform(scope, res) {
			return new Promise(function (resolve, reject) {
				if (res && res.data) {
					if (!Array.isArray(scope)) {
						scope['poster'] = res.data;
					}
				}
				resolve(scope);
			});
		}
	}]);

	return BEApiQueuePosters;
})(BEApiQueueBaseMethod);

BEApiQueue.register('posters', BEApiQueuePosters);

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
			var _this16 = this;

			return new Promise(function (resolve) {
				resolve([{
					url: 'objects/' + scope.id + '/relations/' + _this16.options.relName
				}]);
			});
		}
	}, {
		key: 'transform',
		value: function transform(scope, res) {
			var _this17 = this;

			return new Promise(function (resolve, reject) {
				scope['relations'] = scope['relations'] || {};
				scope['relations'][_this17.options.relName] = scope['relations'][_this17.options.relName] || {};
				scope['relations'][_this17.options.relName].objects = res.data.objects;
				resolve(scope);
			});
		}
	}]);

	return BEApiQueueRelation;
})(BEApiQueueBaseMethod);

BEApiQueue.register('relation', BEApiQueueRelation);

//# sourceMappingURL=beapi.js.map
//# sourceMappingURL=beapi.js.map
