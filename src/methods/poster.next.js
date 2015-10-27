import { BEApiQueue, BEApiQueueBaseMethod } from '../beapi.queue.next.js';

class BEApiQueuePoster extends BEApiQueueBaseMethod {

	constructor(options = {}) {
		super(options);
	}

	input(scope) {
		return new Promise((resolve) => {
			var suffix = '';
			if (this.options) {
				suffix = '?';
				for (var k in this.options) {
					suffix += k + '=' + this.options[k];
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
		return new Promise((resolve, reject) => {
			if (res && res.data) {
				scope['poster'] = res.data;
			}
			resolve(scope);
		});
	}

}

BEApiQueue.register('poster', BEApiQueuePoster);
