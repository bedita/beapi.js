"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var BEModel = (function () {
	function BEModel(conf) {
		_classCallCheck(this, BEModel);

		this.conf = conf;
	}

	_createClass(BEModel, [{
		key: "config",
		value: function config(conf) {
			this.conf = conf;
		}
	}]);

	return BEModel;
})();
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x3, _x4, _x5) { var _again = true; _function: while (_again) { var object = _x3, property = _x4, receiver = _x5; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x3 = parent; _x4 = property; _x5 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var BECollection = (function (_BEModel) {
    _inherits(BECollection, _BEModel);

    function BECollection() {
        var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
        var conf = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

        _classCallCheck(this, BECollection);

        _get(Object.getPrototypeOf(BECollection.prototype), 'constructor', this).call(this, conf);
        var that = this;
        if (options.alias) {
            this.alias = options.alias;
            if (options.filter) {
                this.items = options.alias.filter(options.filter) || [];
            } else {
                this.items = options.alias.items || [];
            }
        } else {
            this.items = options.items || options.objects || [];
        }
        this.url = options.url;
        this.length = options.count || this.items.length || 0;
        this.forEach(function (obj, index) {
            if (!(obj instanceof BEObject)) {
                obj = new BEObject(obj, that.conf);
            }
            that.items[index] = obj;
            that[index] = obj;
        });
    }

    _createClass(BECollection, [{
        key: 'fetch',
        value: function fetch(url) {
            var that = this;
            return new Promise(function (resolve, reject) {
                if (that.url || url) {
                    if (that.alias) {
                        return that.alias.fetch(that.url || url || undefined);
                    }
                    var beapi = new BEApi(that.conf);
                    beapi.get(that.url || url).then(function (res) {
                        if (res && res.data && res.data.objects) {
                            for (var i = 0; i < res.data.objects.length; i++) {
                                var obj = res.data.objects[i];
                                that.items[i] = new BEObject(obj, that.conf);
                            }
                            that.items.slice(res.data.objects.length);
                            that.length = that.items.length;
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
        key: 'forEach',
        value: function forEach(callback) {
            if (typeof callback !== 'function') {
                return;
            }
            var that = this;
            for (var i = 0, len = this.length; i < len; i++) {
                callback.call(that, that.item(i), i);
            }
        }
    }, {
        key: 'item',
        value: function item(index) {
            return this.items[index];
        }
    }, {
        key: 'filter',
        value: function filter(f) {
            return this.items.filter(function (item) {
                return item.is(f);
            });
        }
    }]);

    return BECollection;
})(BEModel);
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x3, _x4, _x5) { var _again = true; _function: while (_again) { var object = _x3, property = _x4, receiver = _x5; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x3 = parent; _x4 = property; _x5 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

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
                    var promise = new BEApi(that.conf).get('objects/' + that.id);
                    promise.then(function (res) {
                        if (res && res.data && res.data.object) {
                            that.set(res.data.object);
                        }
                    });
                    return promise;
                } else {
                    reject();
                }
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
                var list = new BECollection(options, that.conf);
                Object.defineProperty(that.relations, name, {
                    configurable: false,
                    get: function get() {
                        return list;
                    }
                });
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
                }, that.conf);
                if (children.sections) {
                    this.sections = new BECollection({
                        alias: this.children,
                        filter: {
                            object_type: 'Section'
                        },
                        url: children.sections.url,
                        count: children.sections
                    }, that.conf);
                }
            }

            delete data['relations'];
            delete data['children'];

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
            var queue = new BEApiQueue(this.conf);
            if ('id' in this && 'nickname' in this) {
                queue.identity(this);
            } else {
                queue.objects(this.id || this.nickname);
            }
            queue.all(function (scope) {
                that.set(scope);
            });
            return queue;
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
				responseType: 'text/json',
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
					var data = oReq.responseText;
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

function processInput() {
  var conf = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  if (conf) {
    if (typeof conf == 'string') {
      conf = { url: conf };
    }
    return conf;
  }
}

var BEApiRegistry = (function () {
  function BEApiRegistry() {
    _classCallCheck(this, BEApiRegistry);
  }

  _createClass(BEApiRegistry, null, [{
    key: 'add',
    value: function add(key) {
      var conf = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

      BEApiRegistry._instances = BEApiRegistry._instances || {};
      BEApiRegistry._instances[key] = conf;
    }
  }, {
    key: 'getInstance',
    value: function getInstance(key) {
      BEApiRegistry._instances = BEApiRegistry._instances || {};
      if (typeof BEApiRegistry._instances[key] !== 'undefined') {
        return BEApiRegistry._instances[key];
      }
    }
  }, {
    key: 'remove',
    value: function remove(key) {
      BEApiRegistry._instances = BEApiRegistry._instances || {};
      if (typeof BEApiRegistry._instances[key] !== 'undefined') {
        delete BEApiRegistry._instances[key];
      }
    }
  }]);

  return BEApiRegistry;
})();

var BEApi = (function () {
  _createClass(BEApi, null, [{
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
    set: function set(storage) {
      this._storage = storage;
    }
  }, {
    key: 'xhr',
    get: function get() {
      return BEXhr.xhr;
    },
    set: function set(xhr) {
      BEXhr.xhr = xhr;
    }
  }]);

  function BEApi() {
    var conf = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, BEApi);

    var opt = {
      baseUrl: undefined,
      accessTokenKey: 'be_access_token',
      refreshTokenKey: 'be_refresh_token',
      accessTokenExpireDate: 'be_access_token_expire_date'
    };

    for (var k in conf) {
      opt[k] = conf[k];
    }

    if (!opt.baseUrl) {
      try {
        opt.baseUrl = window.location.protocol + '//' + window.location.hostname + (window.location.port ? ':' + window.location.port : '') + '/api/latest/';
      } catch (ex) {
        //
      }
    }

    this.conf = opt;
    BEApiRegistry.add(this.configKey, this.conf);
  }

  _createClass(BEApi, [{
    key: '_getOptions',
    value: function _getOptions(opt) {
      var res = this.conf;
      for (var k in opt) {
        res[k] = opt[k];
      }
      res['accessToken'] = this.getAccessToken();

      var url = res.url || '/',
          accessToken = res.accessToken;

      if (/^([\w\-]+:)?\/{2,3}/.test(url)) {
        if (url.indexOf(conf.baseUrl) !== 0) {
          throw 'Invalid url';
        }
      } else {
        if (url[0] !== '/') {
          url = res.baseUrl + (res.baseUrl[res.baseUrl.length - 1] == '/' ? url : '/' + url);
        } else {
          url = res.baseUrl + (res.baseUrl[res.baseUrl.length - 1] == '/' ? url.slice(1) : url);
        }
      }
      res['url'] = url;

      if (accessToken) {
        res['headers'] = res['headers'] && 'object' == typeof res['headers'] ? res['headers'] : {};
        res['headers']['Authorization'] = 'Bearer ' + accessToken;
      }

      res.type = res.method = res.type || res.method || 'GET';

      return res;
    }
  }, {
    key: 'setBaseUrl',
    value: function setBaseUrl(url) {
      this.conf.baseUrl = url;
    }
  }, {
    key: 'processXHR',
    value: function processXHR() {
      var conf = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      if (this.getAccessToken() && this.isTokenExpired()) {
        return new Promise(function (resolve, reject) {
          var doXHR = function doXHR() {
            delete conf.headers['Authorization'];
            conf = this._getOptions(conf);
            BEXhr.exec(conf).then(function () {
              resolve.apply(this, arguments);
            }, function () {
              reject.apply(this, arguments);
            });
          };
          this.refreshToken().then(doXHR, doXHR);
        });
      } else {
        return BEXhr.exec(conf);
      }
    }
  }, {
    key: 'get',
    value: function get() {
      var conf = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      conf = processInput(conf);
      conf.type = 'GET';
      conf = this._getOptions(conf);
      return this.processXHR(conf);
    }
  }, {
    key: 'post',
    value: function post(conf, data) {
      if (conf === undefined) conf = {};

      conf = processInput(conf);
      conf.data = data ? _extend(conf.data || {}, data) : conf.data;
      conf.type = 'POST';
      conf = this._getOptions(conf);
      return this.processXHR(conf);
    }
  }, {
    key: 'put',
    value: function put(conf, data) {
      if (conf === undefined) conf = {};

      conf = processInput(conf);
      conf.data = data ? _extend(conf.data || {}, data) : conf.data;
      conf.type = 'PUT';
      conf = this._getOptions(conf);
      return this.processXHR(conf);
    }
  }, {
    key: 'delete',
    value: function _delete() {
      var conf = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      conf = processInput(conf);
      conf.type = 'DELETE';
      conf = this._getOptions(conf);
      return this.processXHR(conf);
    }
  }, {
    key: 'processAuth',
    value: function processAuth() {
      var conf = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      conf.url = 'auth';
      var self = this,
          storage = BEApi.storage,
          opt = this.conf,
          promise = this.post(conf);
      promise.then(function (res) {
        if (res && res.data && res.data.access_token) {
          storage.setItem(opt.accessTokenKey, res.data.access_token);
          storage.setItem(opt.refreshTokenKey, res.data.refresh_token);
          storage.setItem(opt.accessTokenExpireDate, Date.now() + res.data.expires_in * 1000);
        } else {
          storage.removeItem(opt.accessTokenKey);
          storage.removeItem(opt.refreshTokenKey);
          storage.removeItem(opt.accessTokenExpireDate);
        }
      }, function () {
        storage.removeItem(opt.accessTokenKey);
        storage.removeItem(opt.refreshTokenKey);
        storage.removeItem(opt.accessTokenExpireDate);
      });
      return promise;
    }
  }, {
    key: 'auth',
    value: function auth(user, pwd) {
      var conf = {
        data: {
          username: user,
          password: pwd
        }
      };
      return this.processAuth(conf);
    }
  }, {
    key: 'refreshToken',
    value: function refreshToken() {
      var storage = BEApi.storage,
          opt = this.conf,
          conf = {
        data: {
          grant_type: 'refresh_token',
          refresh_token: this.getRefreshToken()
        }
      };
      storage.removeItem(opt.accessTokenKey);
      storage.removeItem(opt.accessTokenExpireDate);
      return this.processAuth(conf);
    }
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
  }, {
    key: 'getAccessToken',
    value: function getAccessToken() {
      return BEApi.storage.getItem(this.conf.accessTokenKey);
    }
  }, {
    key: 'getRefreshToken',
    value: function getRefreshToken() {
      return BEApi.storage.getItem(this.conf.refreshTokenKey);
    }
  }, {
    key: 'getAccessTokenExpireDate',
    value: function getAccessTokenExpireDate() {
      var data = BEApi.storage.getItem(this.conf.accessTokenExpireDate);
      if (data) {
        data = parseInt(data);
        return new Date(data);
      }
    }
  }, {
    key: 'isTokenExpired',
    value: function isTokenExpired() {
      return new Date() >= this.getAccessTokenExpireDate();
    }
  }, {
    key: 'defaultConfigKey',
    get: function get() {
      return 'default';
    }
  }, {
    key: 'configKey',
    get: function get() {
      return this.conf && this.conf.configKey || this.defaultConfigKey;
    }
  }], [{
    key: 'extend',
    value: function extend(method, fn) {
      if (typeof fn == 'function' && typeof BEApi.prototype[method] == 'undefined') {
        BEApi.prototype[method] = fn;
      }
    }
  }]);

  return BEApi;
})();
'use strict';

var _bind = Function.prototype.bind;

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var BEApiQueue = (function () {
	_createClass(BEApiQueue, [{
		key: '_queue',
		get: function get() {
			return this.__queue || [];
		},
		set: function set(ar) {
			if (Array.isArray(ar)) {
				this.__queue = ar;
			}
		}
	}]);

	function BEApiQueue(conf) {
		_classCallCheck(this, BEApiQueue);

		var that = this;
		if (typeof conf === 'string') {
			this.conf = BEApiRegistry.getInstance(conf);
		} else if (typeof conf === 'object') {
			this.conf = conf;
		} else {
			throw 'No BEApi configuration provided.';
		}
		this._promise = new Promise(function (resolve, reject) {
			that._resolver = resolve;
			that._rejecter = reject;
		});
		this._reset();
	}

	_createClass(BEApiQueue, [{
		key: '_add',
		value: function _add(task) {
			task.push(new Promise(function (resolve, reject) {
				task.push(resolve);
				task.push(reject);
			}));
			this._queue.push(task);
		}
	}, {
		key: '_reset',
		value: function _reset() {
			this._queue = [];
		}
	}, {
		key: 'exec',
		value: function exec() {
			var self = this,
			    queue = this._queue,
			    beapi = new BEApi(this.conf),
			    scope;

			if (queue.length == 0) {
				self._resolver(scope);
			} else {
				(function () {
					var _exec = function _exec(queue, index) {
						index = index || 0;
						if (index == queue.length) {
							return self._resolver(scope);
						}
						var task = queue[index],
						    method = task[0],
						    args = task[1],
						    resolver = task[2],
						    rejecter = task[3],
						    promise = task[4],
						    config = new (_bind.apply(BEApiQueue.tasks[method], [null].concat(_toConsumableArray(args))))();

						var onLoad = function onLoad(res) {
							config.validate(res).then(function () {
								config.transform(scope, res).then(function (obj) {
									scope = obj;
									resolver(scope);
									_exec(queue, index + 1);
								}, function (err) {
									rejecter(scope);
									self._rejecter(err);
								});
							}, function (err) {
								reject(err);
							});
						};

						config.input.call(config, scope).then(function (options) {
							beapi[config.type.toLowerCase()].apply(beapi, options).then(onLoad, onLoad);
						});
					};

					_exec(queue);
				})();
			}
			return this._promise;
		}
	}, {
		key: 'get',
		value: function get() {
			return this.exec();
		}
	}, {
		key: 'then',
		value: function then(done, fail) {
			if (this._queue.length) {
				return this._queue[this._queue.length - 1][4].then(done, fail);
			}
		}
	}, {
		key: 'all',
		value: function all(done, fail) {
			if (this._promise) {
				return this._promise.then(done, fail);
			}
		}
	}], [{
		key: 'register',
		value: function register(taskName, def) {
			if (taskName && BEApiQueue._reserved.indexOf(taskName) !== -1) {
				throw 'Reserved method';
			}

			BEApiQueue.tasks = BEApiQueue.tasks || {};
			BEApiQueue.tasks[taskName] = def;

			(function (method) {
				BEApiQueue.prototype[method] = function () {
					for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
						args[_key] = arguments[_key];
					}

					this._add([method, args]);
					return this;
				};
			})(taskName);
		}
	}, {
		key: '_reserved',
		get: function get() {
			return ['exec', 'get'];
		}
	}]);

	return BEApiQueue;
})();

var BEApiQueueMethod = (function () {
	_createClass(BEApiQueueMethod, [{
		key: 'type',
		get: function get() {
			return 'get';
		}
	}]);

	function BEApiQueueMethod() {
		var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

		_classCallCheck(this, BEApiQueueMethod);

		this.options = options;
	}

	_createClass(BEApiQueueMethod, [{
		key: 'input',
		value: function input(scope) {
			for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
				args[_key2 - 1] = arguments[_key2];
			}

			return new Promise(function (resolve) {
				resolve(args);
			});
		}
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
	}, {
		key: 'transform',
		value: function transform(scope, res) {
			return new Promise(function (resolve) {
				resolve(scope);
			});
		}
	}]);

	return BEApiQueueMethod;
})();
'use strict';
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var BEApiQueueIdentity = (function (_BEApiQueueMethod) {
	_inherits(BEApiQueueIdentity, _BEApiQueueMethod);

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
})(BEApiQueueMethod);

BEApiQueue.register('identity', BEApiQueueIdentity);
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var BEApiQueueObjects = (function (_BEApiQueueMethod) {
	_inherits(BEApiQueueObjects, _BEApiQueueMethod);

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
})(BEApiQueueMethod);

BEApiQueue.register('objects', BEApiQueueObjects);
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var BEApiQueueRelation = (function (_BEApiQueueMethod) {
	_inherits(BEApiQueueRelation, _BEApiQueueMethod);

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
})(BEApiQueueMethod);

BEApiQueue.register('relation', BEApiQueueRelation);

//# sourceMappingURL=beapi.js.map