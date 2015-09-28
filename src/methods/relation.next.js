import { BEApiQueue, BEApiQueueBaseMethod } from '../beapi.queue.next.js';

class BEApiQueueRelation extends BEApiQueueBaseMethod {

	constructor(relName) {
		super({
			relName: relName
		});
	}

	input(scope) {
		var self = this;
		return new Promise(function (resolve) {
			resolve([
				{
					url: 'objects/' + scope.id + '/relations/' + self.options.relName
				}
			]);
		})
	}

	transform(scope, res) {
		var self = this;
		return new Promise(function (resolve, reject) {
			scope['relations'] = scope['relations'] || {};
			scope['relations'][self.options.relName] = scope['relations'][self.options.relName] || {};
			scope['relations'][self.options.relName].objects = res.data.objects;
			resolve(scope);
		});
	}

}

BEApiQueue.register('relation', BEApiQueueRelation);
