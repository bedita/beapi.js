import { BEApiQueue, BEApiQueueBaseMethod } from '../beapi.queue.next.js';

export class BEApiQueueIdentity extends BEApiQueueBaseMethod {

	constructor(data) {
		super({
			id: data.id,
			data: data
		});
	}

	validate() {
		return new Promise((resolve) => {
			resolve();
		});
	}

	input(scope) {
		return new Promise((resolve) => {
			resolve([
				{
					url: '/'
				}
			]);
		});
	}

	transform(scope, res) {
		return new Promise((resolve, reject) => {
			resolve(this.options.data);
		});
	}

}

BEApiQueue.register('identity', BEApiQueueIdentity);
