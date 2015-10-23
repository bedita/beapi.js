/**
 * XMLHttpRequest wrapper for the browser.
 * @class
 */
export class BEXhr {

	/**
	 * Retrieve the Ajax interface.
	 * The Ajax is used to perform XMLHttpRequest requests.
	 * By default, the Ajax interface in the browser is the XMLHttpRequest {@link https://developer.mozilla.org/it/docs/Web/API/XMLHttpRequest}.
	 * while in a Node environment is `xmlhttprequest` {@link https://www.npmjs.com/package/xmlhttprequest}.
	 * @static
	 * @return {Object} The Ajax interface.
	 */
	static get xhr() {
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
	}

	/**
	 * Set a custom the Ajax interface.
	 * Set an alternative Ajax interface compatible with a `XMLHttpRequest` like pattern {@link https://developer.mozilla.org/it/docs/Web/API/XMLHttpRequest}.
	 * @static
	 * @param {Class} xhr A valid and compatible Ajax interface.
	 */
	static set xhr(xhr) {
		this._xhr = xhr;
	}

	/**
	 * Perform an Ajax request.
	 * Set an alternative Ajax interface compatible with a `XMLHttpRequest` like pattern {@link https://developer.mozilla.org/it/docs/Web/API/XMLHttpRequest}.
	 * @static
	 * @param {Object} options A set of options for the Ajax request.
	 * @return {Promise}
	 */
	static exec(options = {}) {
		var defaults = {
			type: 'GET',
			async: true,
			responseType: 'json',
			headers: {},
			data: undefined
		}
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
		return new Promise(function(resolve, reject) {
			// instantiate the Ajax interface (@see {@link BEXhr.xhr})
			var oReq = new BEXhr.xhr();

			// done listener
			oReq.addEventListener('load', function() {
				var data;
				try {
					data = oReq.response || oReq.responseText || '';
				} catch(ex) {
					//
				}
				// try to convert JSON data into object
				if (data && data !== '') {
					try {
						data = JSON.parse(data);
					} catch(er) {
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
			oReq.addEventListener('error', function() {
				reject(oReq);
			}, false);

			oReq.addEventListener('abort', function() {
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

}
