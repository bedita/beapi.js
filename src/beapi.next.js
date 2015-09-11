import { BEXhr } from './xhr.next.js';
import { BEOptionsBuilder } from './options-builder.next.js';
import { BEApiChain } from './chain.next.js';
import './methods/all.next.js';

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

	constructor(options = {}) {
		var opt = {
			baseUrl: undefined,
			accessTokenKey: 'be_access_token',
		    refreshTokenKey: 'be_refresh_token',
		    accessTokenExpireDate: 'be_access_token_expire_date',
		}

        for (var k in options) {
            opt[k] = options[k];
        }

		if (!opt.baseUrl) {
			try {
		        opt.baseUrl = window.location.protocol + '//' + window.location.hostname + (window.location.port ? ':' + window.location.port: '') + '/api/latest/';
		    } catch (ex) {
		        //
	    	}
		}

		this.options = opt;
	}

	_getOptions(opt) {
		var res = this.options;
		for (var k in opt) {
            res[k] = opt[k];
        }
		res['accessToken'] = this.getAccessToken();
		return BEOptionsBuilder.build(res);
	}

	setBaseUrl(url) {
		this.options.baseUrl = url;
	}

	processXHR(options = {}) {
        if (this.getAccessToken() && this.isTokenExpired()) {
            return new Promise(function(resolve, reject) {
                var doXHR = function() {
                    delete options.headers['Authorization'];
                    options = this._getOptions(options);
                    BEXhr.exec(options).then(function() {
                        resolve.apply(this, arguments);
                    }, function() {
                        reject.apply(this, arguments);
                    });
                }
                this.refreshToken().then(doXHR, doXHR);
            });
        } else {
            return BEXhr.exec(options);
        }
    }

	get(options = {}) {
        options = BEApi.processInput(options);
        options.type = 'GET';
        options = this._getOptions(options);
        return this.processXHR(options);
    }

    post(options = {}, data) {
        options = BEApi.processInput(options);
        options.data = data ? _extend(options.data || {}, data) : options.data;
        options.type = 'POST';
        options = this._getOptions(options);
        return this.processXHR(options);
    }

    put(options = {}, data) {
        options = BEApi.processInput(options);
        options.data = data ? _extend(options.data || {}, data) : options.data;
        options.type = 'PUT';
        options = this._getOptions(options);
        return this.processXHR(options);
    }

    delete(options = {}) {
        options = BEApi.processInput(options);
        options.type = 'DELETE';
        options = this._getOptions(options);
        return this.processXHR(options);
    }

	processAuth(options = {}) {
        options.url = 'auth';
        var self = this,
			storage = BEApi.storage,
			opt = this.options,
			promise = this.post(options);
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
        var options = {
            data: {
                username: user,
                password: pwd
            }
        }
        return this.processAuth(options);
    }

    refreshToken() {
		var storage = BEApi.storage,
			opt = this.options,
        	options = {
	            data: {
	                grant_type: 'refresh_token',
	                refresh_token: this.getRefreshToken(),
	            }
	        }
        storage.removeItem(opt.accessTokenKey);
        storage.removeItem(opt.accessTokenExpireDate);
        return this.processAuth(options);
    }

    logout() {
		var storage = BEApi.storage,
			opt = this.options,
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
        return BEApi.storage.getItem(this.options.accessTokenKey);
    }

    getRefreshToken() {
        return BEApi.storage.getItem(this.options.refreshTokenKey);
    }

    getAccessTokenExpireDate() {
        var data = BEApi.storage.getItem(this.options.accessTokenExpireDate);
        if (data) {
            data = parseInt(data);
            return new Date(data);
        }
    }

    isTokenExpired() {
        return new Date() >= this.getAccessTokenExpireDate();
    }

	query() {
		return new BEApiChain(this);
	}

	object(id) {
		return this.query().objects(id);
	}

	static processInput(options) {
        if (typeof options == 'string') {
            options = { url: options };
        }
        return options;
    }

}
