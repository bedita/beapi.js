import { BEApiQueue, BEApiQueueBaseMethod } from '../beapi.queue.next.js';

class BEApiQueueObjects extends BEApiQueueBaseMethod {

	constructor(id, type) {
		super({
			id: id,
			type: type
		});
	}

	input(scope) {
		return new Promise((resolve) => {
			resolve([
				{
					url: (this.options.type ? this.options.type + 's' : 'objects') + (this.options.id ? '/' + this.options.id : '')
				}
			]);
		})
	}

	transform(scope, res) {
		return new Promise((resolve, reject) => {
			if (res.data.object) {
				scope = res.data.object;
			}
			resolve(scope);
		});
	}

}

BEApiQueue.register('objects', BEApiQueueObjects);
