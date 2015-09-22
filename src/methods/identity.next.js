import { BEApiQueue, BEApiQueueMethod } from '../beapi.queue.next.js';

export class BEApiQueueIdentity extends BEApiQueueMethod {

	constructor(data) {
		super({
			id: data.id,
			data: data
		});
	}

	validate() {
		return new Promise(function (resolve) {
			resolve();
		});
	}

	input(scope) {
		var self = this;
		return new Promise(function (resolve) {
			resolve([
				{
					url: '/'
				}
			]);
		});
	}

	transform(scope, res) {
		var self = this;
		return new Promise(function (resolve, reject) {
			resolve(self.options.data);
		});
	}

}

BEApiQueue.register('identity', BEApiQueueIdentity);
