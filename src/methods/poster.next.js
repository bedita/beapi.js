import { BEApiQueue, BEApiQueueBaseMethod } from '../beapi.queue.next.js';

class BEApiQueuePoster extends BEApiQueueBaseMethod {

	constructor(options = {}) {
		super(options);
	}

	input(scope) {
		var self = this;
		return new Promise(function (resolve) {
			var suffix = '';
			if (self.options) {
				suffix = '?';
				for (var k in self.options) {
					suffix += k + '=' + self.options[k];
				}
			}
			resolve([
				{
					url: 'poster/' + scope.id + suffix
				}
			]);
		})
	}

	transform(scope, res) {
		var self = this;
		return new Promise(function (resolve, reject) {
			if (res && res.data) {
				scope['poster'] = res.data;
			}
			resolve(scope);
		});
	}

}

BEApiQueue.register('poster', BEApiQueuePoster);
