import { BEApiQueue, BEApiQueueBaseMethod } from '../beapi.queue.next.js';

class BEApiQueuePosters extends BEApiQueueBaseMethod {

	constructor(options = {}) {
		super(options);
	}

	input(scope) {
		return new Promise((resolve, reject) => {
			var suffix = '';
			if (this.options) {
				for (var k in this.options) {
					suffix = suffix || '?';
					suffix += k + '=' + this.options[k];
				}
			}
			if (!Array.isArray(scope)) {
				resolve([
					{
						url: 'posters/' + scope.id + suffix
					}
				]);
			} else {
				let ids = scope.map(function (obj) {
					return obj.id;
				});
				let oldSuffix = suffix;
				suffix = '?id=' + ids.join(',');
				if (oldSuffix) {
					suffix += '&' + oldSuffix.substring(1, oldSuffix.length);
				}
				resolve([
					{
						url: 'posters' + suffix
					}
				]);
			}
		})
	}

	transform(scope, res) {
		return new Promise((resolve, reject) => {
			if (res && res.data) {
				if (!Array.isArray(scope)) {
					scope['poster'] = res.data;
				}
			}
			resolve(scope);
		});
	}

}

BEApiQueue.register('posters', BEApiQueuePosters);
