(function() {

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

    var _extend = function() {
        var res = arguments[0];
        for (var i = 1; i < arguments.length; i++) {
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
        if (promise && promise.status == 'pending') {
            promise.status = 'resolved';
            promise.resolveArgs = arguments;
            var callbacks = promise.callbacks.y;
            for (var i = 0; i < callbacks.length; i++) {
                callbacks[i].apply(promise, arguments);
            }
        }
        return promise;
    }

    Deferred.prototype.reject = function() {
        var promise = this.promise;
        if (promise && promise.status == 'pending') {
            promise.status = 'rejected';
            promise.rejectArgs = arguments;
            var callbacks = promise.callbacks.n;
            for (var i = 0; i < callbacks.length; i++) {
                callbacks[i].apply(promise, arguments);
            }
        }
        return promise;
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
    }

    var RelationList = function RelationList(parent, list, related) {
        var that = this;
        list = list || [];

        Object.defineProperty(that, 'length', {
            enumerable: false,
            configurable: true,
            get: function() {
                return list.length || 0;
            },
            set: function() {
                return list.length || 0;
            }
        });

        Object.defineProperty(that, 'item', {
            enumerable: false,
            configurable: true,
            get: function() {
                return function(index) {
                    if (index >= 0 && index < that.length) {
                        var rel = list[index];
                        if (rel) {
                            var obj = related[rel.id_right || rel.id_left];
                            if (obj) {
                                return new BEObject(obj);
                            }
                        }
                    }
                }
            },
            set: function() {}
        });

        function bindKeyId(id) {
            Object.defineProperty(that, id, {
                enumerable: false,
                configurable: true,
                get: function() {
                    var obj = related[id];
                    if (obj) {
                        return new BEObject(obj);
                    }
                },
                set: function(data) {
                    if (related[id]) {
                        related[id] = data;
                    }
                }
            });
        }

        for (var i = 0; i < list.length; i++) {
            if (typeof list[i] == 'object') {
                bindKeyId(list[i].id_right || list[i].id_left);
            } else {
                bindKeyId(list[i]);
            }
        }
    }

    RelationList.prototype.forEach = function(callback) {
        if (typeof callback !== 'function') {
            return;
        }
        var len = this.length;
        var that = this;
        for (var i = 0; i < len; i++) {
            callback.call(that, that.item(i), i);
        }
    }

    var BEObjectsRegistry = {};

    BEObjectsRegistry.has = function(obj) {
        var id = obj;
        if (typeof id == 'object') {
            id = obj.id;
        }
        return (id && this[id]);
    }

    BEObjectsRegistry.get = function(id) {
        if (this.has(id)) {
            return this[id];
        }
    }

    BEObjectsRegistry.add = function(obj) {
        if (obj.id) {
            this[obj.id] = obj;
        }
    }

    BEObjectsRegistry.remove = function(obj) {
        if (this.has(obj)) {
            delete this[obj.id];
        }
    }

    var BEObject = function BEObject(data, related) {
        if (BEObjectsRegistry.has(data)) {
            var obj = BEObjectsRegistry.get(data.id);
            return obj.update(data, related);
        } else {
            this.update(data, related);
            BEObjectsRegistry.add(this);
        }
    }

    BEObject.prototype.fetch = function() {
        var that = this;
        if (that.id) {
            var promise = beapi.objects(that.id);
            promise.done(function(res) {
                if (res && res.data && res.data.object) {
                    that.update(res.data.object);
                }
            });
            return promise;
        } else {
            var dfr = new Deferred();
            return dfr.reject();
        }
    }

    var isoDateRegex = /\d{4,}\-\d{2,}\-\d{2,}T\d{2,}:\d{2,}:\d{2,}\+\d{4,}/;

    BEObject.prototype.update = function(data, related) {
        var that = this;
        var relations = data.relations || {};
        var children = data.children || {};
        var relationList = data.relations ? {} : false;
        var childrenList = data.children ? {} : false;
        related = related || {};

        Object.defineProperty(that, 'relations', {
            enumerable: false,
            configurable: true,
            get: function() {
                return relationList;
            },
            set: function(relations) {
                var that = this;
                var res = {};
                for (var k in relations) {
                    res[k] = new RelationList(that, relations[k], related);
                }
                relationList = res;
            }
        });

        if (data.relations) {
            this.relations = relations;
        }

        Object.defineProperty(that, 'children', {
            enumerable: false,
            configurable: true,
            get: function() {
                return childrenList;
            },
            set: function(children) {
                var that = this;
                var res = {};
                for (var k in children) {
                    res[k] = new RelationList(that, children[k], related);
                }
                childrenList = res;
            }
        });

        if (data.children) {
            this.children = children;
        }

        Object.defineProperty(that, 'parent', {
            enumerable: false,
            configurable: true,
            get: function() {
                if (this.parent_id && related) {
                    return new BEObject({
                        id: this.parent_id
                    });
                }
                return false;
            },
            set: function() {}
        });

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

        return that;
    }

    var beapi = function(options) {
        options = options || {};
        for (var k in options) {
            this[k] = options[k];
        }
    }

    if ('object' == typeof module && 'object' == typeof module.exports) {
        var LocalStorage = require('node-localstorage').LocalStorage;
        beapi.storage = new LocalStorage('./beapi');
        xhr = require('xmlhttprequest').XMLHttpRequest;
        module.exports = beapi;
    } else {
        beapi.storage = window.localStorage;
        xhr = XMLHttpRequest;
        window.beapi = beapi;
    }

    beapi.baseUrl = '';
    beapi.accessTokenKey = 'be_access_token';
    beapi.refreshTokenKey = 'be_refresh_token';
    beapi.accessTokenExpireDate = 'be_access_token_expire_date';

    try {
        beapi.baseUrl = window.location.protocol + '//' + window.location.hostname + (window.location.port ? ':' + window.location.port: '') + '/api/v1/';
    } catch (ex) {
        //
    }

    beapi.setBaseUrl = function(url) {
        beapi.baseUrl = url;
    }

    // options is a API uri builder result
    beapi.xhr = function(options) {
        var defaults = {
            type: 'GET',
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

        return dfr.promise;
    }

    var optionsBuilder = function(options) {
        var res = options || {};

        var url = options.url || beapi.baseUrl;
        if (/^([\w\-]+:)?\/{2,3}/.test(url)) {
            if (url.indexOf(beapi.baseUrl) !== 0) {
                throw new Exception('Invalid url');
            }
        } else {
            if (url[0] !== '/') {
                url = beapi.baseUrl + ((beapi.baseUrl[beapi.baseUrl.length - 1]) == '/' ? url : '/' + url);
            } else {
                url = beapi.baseUrl + ((beapi.baseUrl[beapi.baseUrl.length - 1]) == '/' ? url.slice(1) : url);
            }
        }
        res['url'] = url;

        var accessToken = beapi.getAccessToken();
        if (accessToken) {
            res['headers'] = (res['headers'] && 'object' == typeof res['headers']) ? res['headers'] : {};
            res['headers']['Authorization'] = 'Bearer ' + accessToken;
        }

        res.type = res.method = res.type || res.method || 'GET';

        return res;
    }

    var processXHR = function(options) {
        options = options || {};
        if (beapi.getAccessToken() && beapi.isTokenExpired()) {
            var dfr = new Deferred();
            var doXHR = function() {
                delete options.headers['Authorization'];
                options = optionsBuilder(options);
                beapi.xhr(options).then(function() {
                    dfr.resolve.apply(dfr, arguments);
                }, function() {
                    dfr.reject.apply(dfr, arguments);
                });
            }
            beapi.refreshToken().then(doXHR, doXHR);
            return dfr.promise;
        } else {
            return beapi.xhr(options);
        }
    }

    var processInput = function(options) {
        if (typeof options == 'string') {
            options = { url: options };
        }
        return options;
    }

    beapi.get = function(options) {
        options = options ? processInput(options) : {};
        options.type = 'GET';
        options = optionsBuilder(options);
        return processXHR(options);
    }

    beapi.post = function(options, data) {
        options = options ? processInput(options) : {};
        options.data = data ? _extend(options.data || {}, data) : options.data;
        options.type = 'POST';
        options = optionsBuilder(options);
        return processXHR(options);
    }

    beapi.put = function(options, data) {
        options = options ? processInput(options) : {};
        options.data = data ? _extend(options.data || {}, data) : options.data;
        options.type = 'PUT';
        options = optionsBuilder(options);
        return processXHR(options);
    }

    beapi.delete = function(options) {
        options = options ? processInput(options) : {};
        options.type = 'DELETE';
        options = optionsBuilder(options);
        return processXHR(options);
    }

    var processAuth = function(options) {
        options.url = 'auth';
        var promise = beapi.post(options);
        promise.then(function(res) {
            if (res && res.data && res.data.access_token) {
                beapi.storage.setItem(beapi.accessTokenKey, res.data.access_token);
                beapi.storage.setItem(beapi.refreshTokenKey, res.data.refresh_token);
                beapi.storage.setItem(beapi.accessTokenExpireDate, Date.now() + res.data.expires_in * 1000);
            } else {
                beapi.storage.removeItem(beapi.accessTokenKey);
                beapi.storage.removeItem(beapi.refreshTokenKey);
                beapi.storage.removeItem(beapi.accessTokenExpireDate);
            }
        }, function() {
            beapi.storage.removeItem(beapi.accessTokenKey);
            beapi.storage.removeItem(beapi.refreshTokenKey);
            beapi.storage.removeItem(beapi.accessTokenExpireDate);
        });
        return promise;
    }

    beapi.auth = function(user, pwd) {
        var options = {
            data: {
                username: user,
                password: pwd
            }
        }
        return processAuth(options);
    }

    beapi.refreshToken = function() {
        var options = {
            data: {
                grant_type: 'refresh_token',
                refresh_token: beapi.getRefreshToken(),
            }
        }
        beapi.storage.removeItem(beapi.accessTokenKey);
        beapi.storage.removeItem(beapi.accessTokenExpireDate);
        return processAuth(options);
    }

    beapi.logout = function() {
        var promise = beapi.delete({
                url: 'auth/' + beapi.getRefreshToken()
            });
        beapi.storage.removeItem(beapi.accessTokenKey);
        beapi.storage.removeItem(beapi.accessTokenExpireDate);

        var onLogout = function(res) {
            if (res && res.data && res.data.logout) {
                beapi.storage.removeItem(beapi.refreshTokenKey);
            }
        }

        promise.then(onLogout, onLogout);

        return promise;
    }

    beapi.getAccessToken = function() {
        return beapi.storage.getItem(beapi.accessTokenKey);
    }

    beapi.getRefreshToken = function() {
        return beapi.storage.getItem(beapi.refreshTokenKey);
    }

    beapi.getAccessTokenExpireDate = function() {
        var data = beapi.storage.getItem(beapi.accessTokenExpireDate);
        if (data) {
            data = parseInt(data);
            return new Date(data);
        }
    }

    beapi.isTokenExpired = function() {
        return new Date() >= beapi.getAccessTokenExpireDate();
    }

    beapi.objects = function(id, type) {
        var promise = beapi.get({
                url: (type ? type + 's' : 'objects') + (id ? '/' + id : '')
            });

        promise.done(function(res) {
            if (res && res.data && res.data.object) {
                if (Array.isArray(res.data.object)) {
                    list = [];
                    for (var i = 0; i < res.data.object.length; i++) {
                        res.data.object[i] = new BEObject(res.data.object[i], res.data[i].related);
                    }
                } else {
                    res.data.object = new BEObject(res.data.object, res.data.related);
                }
            }
        });

        return promise;
    }

})();