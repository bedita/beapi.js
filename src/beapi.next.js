import { BEXhr } from './helpers/xhr.next.js';
import { BERegistry } from './registry.next.js';

/**
 * Convenience method to process request arguments
 * - If the argument is String typed, set it as url attribute of a set of options
 * @private
 * @param {String|Object} conf The request arguments.
 * @return {Object} A valid set of options for the request.
 */
function _processInput(conf = {}) {
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
function _extend(res = {}, ...args) {
    for (let i = 0; i < args.length; i++) {
        let obj = args[i];
        for (let k in obj) {
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
export class BEApi {

	constructor(conf = {}) {
		if (typeof conf == 'string') {
			let opt = BEApiRegistry.get(conf);
			if (opt) {
				conf = opt;
			} else {
				conf = {};
			}
		}
		// if the base url is not provided, try to extract it from the `window.location`.
		if (!conf.baseUrl) {
			try {
		        conf.baseUrl = window.location.protocol + '//' + window.location.hostname + (window.location.port ? ':' + window.location.port: '') + '/api/latest/';
		    } catch (ex) {
		        throw 'Missing valid `baseUrl`.';
	    	}
		}
		this.conf = conf;
		// add the current configuration to the BEApiRegistry.
		BEApiRegistry.add(this.configKey, conf);
	}

	/**
	 * A set of options.
	 * @type {Object}
	 * @property {String} baseUrl 				The base frontend endpoint.
	 * @property {String} configKey 			The registry key to use to store this BEApi configuration (see {@link BEApiRegistry}).
	 * @property {String} accessTokenKey 		The storage key to use for Access Token when using auth methods.
	 * @property {String} refreshTokenKey		The storage key to use for Refresh Token when using auth methods.
	 * @property {String} accessTokenExpireDate The storage key to use for Access Token Expire Date when using auth methods.
	 */
	get conf() {
		return this._conf;
	}

	/**
	 * Setter for configuration object.
	 * @private
	 * @param {Object} conf A set of options.
	 */
	set conf(conf) {
		let opt = {
			baseUrl: undefined,
			accessTokenKey: 'be_access_token',
		    refreshTokenKey: 'be_refresh_token',
		    accessTokenExpireDate: 'be_access_token_expire_date',
			configKey: this.defaultConfigKey
		}

		for (let k in conf) {
            opt[k] = conf[k];
        }

		this._conf = opt;
	}

	/**
	 * The default register configuration key.
	 * @private
	 * @type {String}
	 */
	get defaultConfigKey() {
		return 'default';
	}

	/**
	 * Return the chosen registry configuration key or the default one.
	 * @type {String}
	 * @default 'default'
	 */
	get configKey() {
		return (this.conf && this.conf.configKey) || this.defaultConfigKey;
	}

	/**
	 * Process and return a complete set of options for the Ajax request.
	 * - Automatically set the authorization headers
	 * - Automatically set the frontend base url when a not full url is passed
	 * @private
	 * @param {Object} options A set of options to pass to the Ajax request.
	 * @return {Object} A complete set of options.
	 */
	_processOptions(options) {
		let opt = _extend({}, options);
		let res = _extend({}, this.conf);
		for (let k in opt) {
            res[k] = opt[k];
        }

		let url = res.url || '/',
			accessToken = this.getAccessToken();

		// check if the provided url is a complete
		if (/^([\w\-]+:)?\/{2,3}/.test(url)) {
			// check if the provided is url is valid (hostname == BEdita frontend host)
			if (url.indexOf(res.baseUrl) !== 0) {
				throw 'Invalid url';
			}
		} else if (url[0] !== '/') {
			url = res.baseUrl + ((res.baseUrl[res.baseUrl.length - 1]) == '/' ? url : '/' + url);
		} else {
			url = res.baseUrl + ((res.baseUrl[res.baseUrl.length - 1]) == '/' ? url.slice(1) : url);
		}

		res['url'] = url;

		if (accessToken) {
			res['headers'] = (res['headers'] && 'object' == typeof res['headers']) ? res['headers'] : {};
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
	_processXHR(opt = {}) {
        if (this.getAccessToken() && this.isTokenExpired() && !opt.skipRefreshToken) {
            return new Promise((resolve, reject) => {
                let refreshCompletePromise = this.refreshToken().then();
				refreshCompletePromise.then(() => {
					delete opt.headers['Authorization'];
                    opt = this._processOptions(opt);
                    BEXhr.exec(opt).then((res) => {
                        resolve(res);
                    }, (xhr) => {
                        reject(xhr);
                    });
				})
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
	_processAuth(opt = {}) {
		opt = _extend({}, opt);
        opt.url = 'auth';
		opt.skipRefreshToken = true;
        let storage = BEApi.storage,
			conf = this.conf,
			promise = this.post(opt);
        promise.then((res) => {
            if (res && res.data && res.data.access_token) {
                storage.setItem(conf.accessTokenKey, res.data.access_token);
                storage.setItem(conf.refreshTokenKey, res.data.refresh_token);
                storage.setItem(conf.accessTokenExpireDate, Date.now() + res.data.expires_in * 1000);
            } else {
                storage.removeItem(conf.accessTokenKey);
                storage.removeItem(conf.refreshTokenKey);
                storage.removeItem(conf.accessTokenExpireDate);
            }
        }, () => {
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
	baseUrl(url) {
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
	get(opt = {}) {
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
    post(opt = {}, data) {
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
    put(opt = {}, data) {
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
    delete(opt = {}) {
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
	auth(username, password) {
        let conf = {
            data: {
                username: username,
                password: password
            }
        }
        return this._processAuth(conf);
    }

	/**
	 * Perform an API Refresh Token request.
	 * - Use {@link _processAuth}
	 * - Retrieve Access Token from the storage (see {@link BEApi#storage}).
	 * @return {Promise} The Ajax request Promise.
	 */
    refreshToken() {
		let storage = BEApi.storage,
			conf = this.conf,
        	opt = {
	            data: {
	                grant_type: 'refresh_token',
	                refresh_token: this.getRefreshToken(),
	            }
	        }
        storage.removeItem(conf.accessTokenKey);
        storage.removeItem(conf.accessTokenExpireDate);
        return this._processAuth(opt);
    }

	/**
	 * Perform an API Logout request.
	 * - Remove all BEApi data from the storage (see {@link BEApi#storage}).
	 * @return {Promise} The Ajax request Promise.
	 */
    logout() {
		let storage = BEApi.storage,
			opt = this.conf,
        	promise = this.delete({
                url: 'auth/' + this.getRefreshToken(),
				skipRefreshToken: true
            });
        storage.removeItem(opt.accessTokenKey);
        storage.removeItem(opt.accessTokenExpireDate);

        return promise.then().then((res) => {
			if (res && res.data && res.data.logout) {
                storage.removeItem(opt.refreshTokenKey);
            }
        });
    }

	/**
	 * Retrieve Access Token from the storage (see {@link BEApi#storage}).
	 * @return {String} The Access Token
	 */
    getAccessToken() {
        return BEApi.storage.getItem(this.conf.accessTokenKey) || undefined;
    }

	/**
	 * Retrieve Refresh Token from the storage (see {@link BEApi#storage}).
	 * @return {String} The Refresh Token
	 */
    getRefreshToken() {
        return BEApi.storage.getItem(this.conf.refreshTokenKey) || undefined;
    }

	/**
	 * Retrieve Access Token Expire Date from the storage (see {@link BEApi#storage}).
	 * @return {Date} The Access Token Expire Date
	 */
    getAccessTokenExpireDate() {
        let data = BEApi.storage.getItem(this.conf.accessTokenExpireDate);
        if (data) {
            data = parseInt(data);
            return new Date(data);
        }
    }

	/**
	 * Check if Access Token is expired
	 * @return {Boolean} If token is expired, return `true`, otherwise `false`
	 */
    isTokenExpired() {
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
	static get storage() {
		if (this._storage) {
			return this._storage;
		}
		if ('object' == typeof module && 'object' == typeof module.exports) {
	        let LocalStorage = require('node-localstorage').LocalStorage;
	        return BEApi.storage = new LocalStorage('./beapi');
	    } else if ('undefined' !== typeof localStorage) {
	        return BEApi.storage = window.localStorage;
	    }
	}

	/**
	 * Set a custom the storage interface.
	 * Set an alternative storage interface with the same LocalStorage API (`setItem`, `getItem` and `removeItem`)
	 * @private
	 * @static
	 */
	static set storage(storage) {
		if (typeof storage['setItem'] === 'function' && typeof storage['getItem'] === 'function' && typeof storage['removeItem'] === 'function') {
			this._storage = storage;
		} else {
			throw 'Invalid custom storage.'
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
	static get xhr() {
		return BEXhr.xhr;
	}

	/**
	 * Set a custom the Ajax interface.
	 * Set an alternative Ajax interface compatible with a `jQuery.ajax` like pattern {@link http://api.jquery.com/jquery.ajax/}
	 * @static
	 * @private
	 * @param {Class} xhr A valid and compatible Ajax interface.
	 */
	static set xhr(xhr) {
		BEXhr.xhr = xhr;
	}

}
