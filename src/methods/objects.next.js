import { BEApiQueue, BEApiQueueBaseMethod } from '../beapi.queue.next.js';

class BEApiQueueObjects extends BEApiQueueBaseMethod {

	constructor(id, type) {
		super({
			id: id,
			type: type
		});
	}

	input(scope) {
		var self = this;
		return new Promise(function (resolve) {
			resolve([
				{
					url: (self.options.type ? self.options.type + 's' : 'objects') + (self.options.id ? '/' + self.options.id : '')
				}
			]);
		})
	}

	transform(scope, res) {
		return new Promise(function (resolve, reject) {
			if (res.data.object) {
				scope = res.data.object;
			}
			resolve(scope);
		});
	}

}

BEApiQueue.register('objects', BEApiQueueObjects);
