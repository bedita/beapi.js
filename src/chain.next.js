export class BEApiChain {

	get _queue() {
		return this.__queue || [];
	}

	set _queue(ar) {
		if (Array.isArray(ar)) {
			this.__queue = ar;
		}
	}

	constructor(BEApiInstance) {
		if (!BEApiInstance || !BEApiInstance.constructor || !BEApiInstance.constructor.name == 'BEApi') {
			throw 'No BEApi instance provided.'
		}
		this._beapi = BEApiInstance;
		this._reset();
	}

	_add(task) {
		this._queue.push(task);
	}

	_reset() {
		this._queue = [];
	}

	exec() {
		var self = this,
			queue = this._queue,
			beapi = this._beapi,
			scope;
		return new Promise(function (resolve, reject) {
			if (queue.length == 0) return resolve(scope);

			function _exec(queue, index) {
				index = index || 0;
				if (index == queue.length) {
					resolve(scope);
				}
				var task = queue[index],
					method = task[0],
					args = task[1],
					config = new BEApiChain.tasks[method](...args);

				var onLoad = function (res) {
					config.validate(res).then(function () {
						config.transform(scope, res).then(function (obj) {
							scope = obj;
							_exec(queue, index + 1);
						}, function (err) {
							reject(err);
						});
					}, function (err) {
						reject(err);
					});
				}

				config.input.call(config, scope).then(function (options) {
					beapi[config.type.toLowerCase()].apply(beapi, options).then(onLoad, onLoad);
				});
			}

			_exec(queue);
		});
	}

	get() {
		return this.exec();
	}

	static register(taskName, def) {
		if (taskName && BEApiChain._reserved.indexOf(taskName) !== -1) {
			throw 'Reserved method';
		}

		BEApiChain.tasks = BEApiChain.tasks || {};
		BEApiChain.tasks[taskName] = def;

		(function (method) {
			BEApiChain.prototype[method] = function (...args) {
				this._add([method, args]);
				return this;
			}
		})(taskName);
	}

	static get _reserved() {
		return ['exec', 'get'];
	}
}

export class BEApiChainMethod {

	get type() {
		return 'get';
	}

	constructor(options = {}) {
		this.options = options;
	}

	input(scope, ...args) {
		return new Promise(function (resolve) {
			resolve(args);
		});
	}

	validate(res) {
		return new Promise(function (resolve, reject) {
			if (res && res.data && (!res.status || (res.status >= 200 && res.status < 300))) {
				resolve();
			} else {
				reject();
			}
		});
	}

	transform(scope, res) {
		return new Promise(function (resolve) {
			resolve(scope);
		});
	}

}
