import { BEApiChain, BEApiChainMethod } from '../chain.next.js';

class BEApiChainObjects extends BEApiChainMethod {

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

BEApiChain.register('objects', BEApiChainObjects);
