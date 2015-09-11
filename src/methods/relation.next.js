import { BEApiChain, BEApiChainMethod } from '../chain.next.js';

class BEApiChainRelation extends BEApiChainMethod {

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
			scope['relations'][self.options.relName] = res.data.objects;
			resolve(scope);
		});
	}

}

BEApiChain.register('relation', BEApiChainRelation);
