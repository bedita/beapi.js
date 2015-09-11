export class BEOptionsBuilder {

	static build(options = {}) {
		var res = options,
			url = options.url,
			accessToken = options.accessToken;

		if (/^([\w\-]+:)?\/{2,3}/.test(url)) {
			if (url.indexOf(options.baseUrl) !== 0) {
				throw 'Invalid url';
			}
		} else {
			if (url[0] !== '/') {
				url = options.baseUrl + ((options.baseUrl[options.baseUrl.length - 1]) == '/' ? url : '/' + url);
			} else {
				url = options.baseUrl + ((options.baseUrl[options.baseUrl.length - 1]) == '/' ? url.slice(1) : url);
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

}
