import { BEApiQueue, BEApiQueueBaseMethod } from '../beapi.queue.next.js';

class BEApiQueueRelation extends BEApiQueueBaseMethod {

	constructor(relName) {
		super({
			relName: relName
		});
	}

	input(scope) {
		return new Promise((resolve) => {
			resolve([
				{
					url: 'objects/' + scope.id + '/relations/' + this.options.relName
				}
			]);
		})
	}

	transform(scope, res) {
		return new Promise((resolve, reject) => {
			scope['relations'] = scope['relations'] || {};
			scope['relations'][this.options.relName] = scope['relations'][this.options.relName] || {};
			scope['relations'][this.options.relName].objects = res.data.objects;
			resolve(scope);
		});
	}

}

BEApiQueue.register('relation', BEApiQueueRelation);
