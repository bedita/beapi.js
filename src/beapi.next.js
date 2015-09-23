import { BEXhr } from './xhr.next.js';

function processInput(conf = {}) {
	if (conf) {
        if (typeof conf == 'string') {
            conf = { url: conf };
        }
        return conf;
    }
}

export class BEApiRegistry {

	static add(key, conf = {}) {
		BEApiRegistry._instances = BEApiRegistry._instances || {};
		BEApiRegistry._instances[key] = conf;
	}

	static getInstance(key) {
		BEApiRegistry._instances = BEApiRegistry._instances || {};
		if (typeof BEApiRegistry._instances[key] !== 'undefined') {
			return BEApiRegistry._instances[key];
		}
	}

	static remove(key) {
		BEApiRegistry._instances = BEApiRegistry._instances || {};
		if (typeof BEApiRegistry._instances[key] !== 'undefined') {
			delete BEApiRegistry._instances[key];
		}
	}

}

export class BEApi {

	static get storage() {
		if (this._storage) {
			return this._storage;
		}
		if ('object' == typeof module && 'object' == typeof module.exports) {
	        var LocalStorage = require('node-localstorage').LocalStorage;
	        return BEApi.storage = new LocalStorage('./beapi');
	    } else if ('undefined' !== typeof localStorage) {
	        return BEApi.storage = window.localStorage;
	    }
	}

	static set storage(storage) {
		this._storage = storage;
	}

	static get xhr() {
		return BEXhr.xhr;
	}

	static set xhr(xhr) {
		BEXhr.xhr = xhr;
	}

	constructor(conf = {}) {
		var opt = {
			baseUrl: undefined,
			accessTokenKey: 'be_access_token',
		    refreshTokenKey: 'be_refresh_token',
		    accessTokenExpireDate: 'be_access_token_expire_date',
		}

        for (var k in conf) {
            opt[k] = conf[k];
        }

		if (!opt.baseUrl) {
			try {
		        opt.baseUrl = window.location.protocol + '//' + window.location.hostname + (window.location.port ? ':' + window.location.port: '') + '/api/latest/';
		    } catch (ex) {
		        //
	    	}
		}

		this.conf = opt;
		BEApiRegistry.add(this.configKey, this.conf);
	}

	get defaultConfigKey() {
		return 'default';
	}

	get configKey() {
		return (this.conf && this.conf.configKey) || this.defaultConfigKey;
	}

	_getOptions(opt) {
		var res = this.conf;
		for (var k in opt) {
            res[k] = opt[k];
        }
		res['accessToken'] = this.getAccessToken();

		var url = res.url || '/',
			accessToken = res.accessToken;

		if (/^([\w\-]+:)?\/{2,3}/.test(url)) {
			if (url.indexOf(res.baseUrl) !== 0) {
				throw 'Invalid url';
			}
		} else {
			if (url[0] !== '/') {
				url = res.baseUrl + ((res.baseUrl[res.baseUrl.length - 1]) == '/' ? url : '/' + url);
			} else {
				url = res.baseUrl + ((res.baseUrl[res.baseUrl.length - 1]) == '/' ? url.slice(1) : url);
			}
		}
		res['url'] = url;

		if (accessToken) {
			res['headers'] = (res['headers'] && 'object' == typeof res['headers']) ? res['headers'] : {};
			res['headers']['Authorization'] = 'Bearer ' + accessToken;
		}

		res.type = res.method = res.type || res.method || 'GET';

		return res;
	}

	setBaseUrl(url) {
		this.conf.baseUrl = url;
	}

	processXHR(conf = {}) {
        if (this.getAccessToken() && this.isTokenExpired()) {
            return new Promise(function(resolve, reject) {
                var doXHR = function() {
                    delete conf.headers['Authorization'];
                    conf = this._getOptions(conf);
                    BEXhr.exec(conf).then(function() {
                        resolve.apply(this, arguments);
                    }, function() {
                        reject.apply(this, arguments);
                    });
                }
                this.refreshToken().then(doXHR, doXHR);
            });
        } else {
            return BEXhr.exec(conf);
        }
    }

	get(conf = {}) {
        conf = processInput(conf);
        conf.type = 'GET';
        conf = this._getOptions(conf);
        return this.processXHR(conf);
    }

    post(conf = {}, data) {
        conf = processInput(conf);
        conf.data = data ? _extend(conf.data || {}, data) : conf.data;
        conf.type = 'POST';
        conf = this._getOptions(conf);
        return this.processXHR(conf);
    }

    put(conf = {}, data) {
        conf = processInput(conf);
        conf.data = data ? _extend(conf.data || {}, data) : conf.data;
        conf.type = 'PUT';
        conf = this._getOptions(conf);
        return this.processXHR(conf);
    }

    delete(conf = {}) {
        conf = processInput(conf);
        conf.type = 'DELETE';
        conf = this._getOptions(conf);
        return this.processXHR(conf);
    }

	processAuth(conf = {}) {
        conf.url = 'auth';
        var self = this,
			storage = BEApi.storage,
			opt = this.conf,
			promise = this.post(conf);
        promise.then(function(res) {
            if (res && res.data && res.data.access_token) {
                storage.setItem(opt.accessTokenKey, res.data.access_token);
                storage.setItem(opt.refreshTokenKey, res.data.refresh_token);
                storage.setItem(opt.accessTokenExpireDate, Date.now() + res.data.expires_in * 1000);
            } else {
                storage.removeItem(opt.accessTokenKey);
                storage.removeItem(opt.refreshTokenKey);
                storage.removeItem(opt.accessTokenExpireDate);
            }
        }, function() {
            storage.removeItem(opt.accessTokenKey);
            storage.removeItem(opt.refreshTokenKey);
            storage.removeItem(opt.accessTokenExpireDate);
        });
        return promise;
    }

	auth(user, pwd) {
        var conf = {
            data: {
                username: user,
                password: pwd
            }
        }
        return this.processAuth(conf);
    }

    refreshToken() {
		var storage = BEApi.storage,
			opt = this.conf,
        	conf = {
	            data: {
	                grant_type: 'refresh_token',
	                refresh_token: this.getRefreshToken(),
	            }
	        }
        storage.removeItem(opt.accessTokenKey);
        storage.removeItem(opt.accessTokenExpireDate);
        return this.processAuth(conf);
    }

    logout() {
		var storage = BEApi.storage,
			opt = this.conf,
        	promise = this.delete({
                url: 'auth/' + this.getRefreshToken()
            });
        storage.removeItem(opt.accessTokenKey);
        storage.removeItem(opt.accessTokenExpireDate);

        var onLogout = function(res) {
            if (res && res.data && res.data.logout) {
                storage.removeItem(opt.refreshTokenKey);
            }
        }
        promise.then(onLogout, onLogout);
        return promise;
    }

    getAccessToken() {
        return BEApi.storage.getItem(this.conf.accessTokenKey);
    }

    getRefreshToken() {
        return BEApi.storage.getItem(this.conf.refreshTokenKey);
    }

    getAccessTokenExpireDate() {
        var data = BEApi.storage.getItem(this.conf.accessTokenExpireDate);
        if (data) {
            data = parseInt(data);
            return new Date(data);
        }
    }

    isTokenExpired() {
        return new Date() >= this.getAccessTokenExpireDate();
    }

	static extend(method, fn) {
		if (typeof fn == 'function' && typeof BEApi.prototype[method] == 'undefined') {
			BEApi.prototype[method] = fn;
		}
	}

}
