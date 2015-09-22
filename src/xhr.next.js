export class BEXhr {

	static get xhr() {
		if (this._xhr) {
			return this._xhr;
		} else {
			if ('object' == typeof module && 'object' == typeof module.exports) {
		        return this.xhr = require('xmlhttprequest').XMLHttpRequest;
		    } else {
		        return window.XMLHttpRequest;
		    }
		}
	}

	static set xhr(xhr) {
		this._xhr = xhr;
	}

	static exec(options = {}) {
		var defaults = {
			type: 'GET',
			async: true,
			responseType: 'json',
			headers: {},
			data: undefined
		}

        var opt = {},
			merge = [defaults, options];
        for (var i = 0; i < merge.length; i++) {
            var obj = merge[i];
            for (var k in obj) {
                opt[k] = obj[k];
            }
        }
		opt.type = opt.type.toUpperCase();
		return new Promise(function(resolve, reject) {
			var oReq = new BEXhr.xhr();

			oReq.addEventListener('load', function() {
				var data = oReq.response || oReq.responseText;
				if (data) {
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

			oReq.addEventListener('error', function() {
				reject(oReq);
			}, false);

			oReq.addEventListener('abort', function() {
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

}
