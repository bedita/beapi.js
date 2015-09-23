import { BEApiQueue, BEApiQueueMethod } from '../beapi.queue.next.js';

class BEApiQueuePoster extends BEApiQueueMethod {

	constructor(options = {}) {
		super(options);
	}

	input(scope) {
		var self = this;
		return new Promise(function (resolve) {
			resolve([
				{
					url: 'poster/' + scope.id
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
