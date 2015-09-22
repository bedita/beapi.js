import { BEApi } from './beapi.next.js';

export class BEApiQueue {

	get _queue() {
		return this.__queue || [];
	}

	set _queue(ar) {
		if (Array.isArray(ar)) {
			this.__queue = ar;
		}
	}

	constructor(conf) {
		var that = this;
		if (typeof conf === 'string') {
			this.conf = BEApiRegistry.getInstance(conf);
		} else if (typeof conf === 'object') {
			this.conf = conf;
		} else {
			throw 'No BEApi configuration provided.'
		}
		this._promise = new Promise(function (resolve, reject) {
			that._resolver = resolve;
			that._rejecter = reject;
		});
		this._reset();
	}

	_add(task) {
		task.push(new Promise(function (resolve, reject) {
			task.push(resolve);
			task.push(reject);
		}));
		this._queue.push(task);
	}

	_reset() {
		this._queue = [];
	}

	exec() {
		var self = this,
			queue = this._queue,
			beapi = new BEApi(this.conf),
			scope;

		if (queue.length == 0) {
			self._resolver(scope);
		} else {
			function _exec(queue, index) {
				index = index || 0;
				if (index == queue.length) {
					return self._resolver(scope);
				}
				var task = queue[index],
					method = task[0],
					args = task[1],
					resolver = task[2],
					rejecter = task[3],
					promise = task[4],
					config = new BEApiQueue.tasks[method](...args);

				var onLoad = function (res) {
					config.validate(res).then(function () {
						config.transform(scope, res).then(function (obj) {
							scope = obj;
							resolver(scope);
							_exec(queue, index + 1);
						}, function (err) {
							rejecter(scope);
							self._rejecter(err);
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
		}
		return this._promise;
	}

	get() {
		return this.exec();
	}

	then(done, fail) {
		if (this._queue.length) {
			return this._queue[this._queue.length - 1][4].then(done, fail);
		} else {
			return this.all(done, fail);
		}
	}

	all(done, fail) {
		if (this._promise) {
			return this._promise.then(done, fail);
		}
	}

	static register(taskName, def) {
		if (taskName && BEApiQueue._reserved.indexOf(taskName) !== -1) {
			throw 'Reserved method';
		}

		BEApiQueue.tasks = BEApiQueue.tasks || {};
		BEApiQueue.tasks[taskName] = def;

		(function (method) {
			BEApiQueue.prototype[method] = function (...args) {
				this._add([method, args]);
				return this;
			}
		})(taskName);
	}

	static get _reserved() {
		return ['exec', 'get'];
	}
}

export class BEApiQueueMethod {

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
