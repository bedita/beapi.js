import { BEApi } from './beapi.next.js';

/**
 * Create a task model to insert into a BEApiQueue.
 * @class
 */
export class BEApiQueueTask {

	/**
	 * Instantiate a BEApiQueueTask Object.
	 * @constructor
	 * @param {Function} method A BEApiQueue Method class constructor.
	 * @param {Array} args The list of arguments to pass to the BEApiQueue Method constructor
	 */
	constructor(method, args = []) {
		if (method) {
			self.fn = method;
		}
		if (args) {
			self.args = args;
		}
		// instantiate the task local promise
		this.promise = new Promise((resolve, reject) => {
			this.resolve = resolve;
			this.reject = reject;
		});
	}

}

/**
 * Create a chainable queue of BEApi requests.
 * @class
 */
export class BEApiQueue {

	/**
	 * Instantiate a BEApiQueue Object.
	 * @constructor
	 * @param {String|Object|BEApi} conf A set of options or a configuration key for BEApiRegistry.
	 */
	constructor(conf) {
		if (typeof conf === 'string') {
			// if conf is a string, try to read configuration from BEApiRegistry
			this.conf = BEApiRegistry.getInstance(conf);
		} else if (conf instanceof BEApi) {
			// if conf is a BEApi instance, grab the configuration with `BEApi.getConfiguration` method
			this.conf = conf.getConfiguration();
		} else if (typeof conf === 'object') {
			// if conf is a plain object, use it
			this.conf = conf;
		} else {
			throw 'No BEApi configuration provided.'
		}
		// setup the global promise and resolvers
		this._promise = new Promise((resolve, reject) => {
			this._resolver = resolve;
			this._rejecter = reject;
		});
		this.reset();
	}

	/**
	 * Reset the queue.
	 * @return {BEApiQueue} the instance
	 */
	reset() {
		this.queue = [];
		return this;
	}

	/**
	 * Add a BEApiQueueTask instance to the queue.
	 * @param {BEApiQueueTask} task
	 * @return {BEApiQueue} the instance
	 */
	add(task) {
		this.queue.push(task);
		return this;
	}

	/**
	 * Perform the queue of requests.
	 * @return {Promise} the global promise
	 */
	exec() {
		var queue = this.queue,
			beapi = new BEApi(this.conf),
			scope;

		// let's start the queue!
		_exec(this, queue);

		function _exec(self, queue, index) {
			index = index || 0;
			if (index == queue.length) {
				// if iterator reached the end of the queue, resolve the global promise
				return self._resolver(scope);
			}
			var task = queue[index],
				method = task.fn,
				args = task.args,
				resolver = task.resolve,
				rejecter = task.reject,
				promise = task.promise,
				traskInstance = new BEApiQueue.tasks[method](...args);

			// process the input arguments using task instance `input` method
			traskInstance.input.call(traskInstance, scope).then((options) => {
				// perform the Ajax request using the BEApi instance
				// `done` and `fail` callbacks both will be process by the local `onLoad` function
				let ajaxMethod = traskInstance.type.toLowerCase();
				if (typeof beapi[ajaxMethod] == 'function') {
					beapi[ajaxMethod].apply(beapi, options).then(onLoad, onLoad);
				}
			});

			function onLoad (res) {
				// validate the request result using task instance `validate` method
				traskInstance.validate(res).then(() => {
					// if validation is succeeded, process the result using task instance `transform` method.
					// The `transform` function of a BEApiQueue Method performs some changes to the request result
					// and to the scope object.
					traskInstance.transform(scope, res).then((obj) => {
						// update the scope
						scope = obj;
						// resolve the task promise
						resolver(scope);
						// execute the next task!
						_exec(self, queue, index + 1);
					}, (err) => {
						// if transformation fails, reject both task and global promises and stop the queue
						rejecter(scope);
						self._rejecter(err);
					});
				}, (err) => {
					// if validation fails, reject both task and global promises and stop the queue
					rejecter(scope);
					self._rejecter(err);
				});
			}
		}

		return this._promise;
	}

	/**
	 * Alias of `BEApiQueue.exec`.
	 * @see {@link BEApiQueue.exec}
	 */
	get() {
		return this.exec();
	}

	/**
	 * Get the first task in queue.
	 * @return {BEApiQueueTask} The first task.
	 */
	first() {
		if (this.queue.length) {
			return this.queue[0];
		}
	}

	/**
	 * Get the last task in queue.
	 * @return {BEApiQueueTask} The last task.
	 */
	last() {
		if (this.queue.length) {
			return this.queue[this.queue.length - 1];
		}
	}

	/**
	 * Alias of the last task in queue `promise.then`.
	 * Attach a success and/or fail callback to the last added task.
	 * If the queue is empty, the method `BEApiQueue.all` {@link BEApiQueue.all} is called instead.
	 * @param {Function} done The success callback [optional].
	 * @param {Function} fail The fail callback [optional].
	 * @return {Promise} The last task promise or the global promise.
	 */
	then(done, fail) {
		if (this.queue.length) {
			return this.last().promise.then(done || BEApiQueue.__noop, fail || BEApiQueue.__noop);
		} else {
			return this.all(done || BEApiQueue.__noop, fail || BEApiQueue.__noop);
		}
	}

	/**
	 * Alias of the global `promise.then`.
	 * Attach a success and/or fail callback to the global queue promise.
	 * @param {Function} done The success callback [optional].
	 * @param {Function} fail The fail callback [optional].
	 * @return {Promise} The global promise.
	 */
	all(done, fail) {
		if (this._promise) {
			return this._promise.then(done || BEApiQueue.__noop, fail || BEApiQueue.__noop);
		}
	}

	/**
	 * Attach a method to the `BEApiQueue.prototype`.
	 * The attached method should be an instance of `BEApiQueueBaseMethod`.
	 * @param {String} taskName The name of the function attached to the prototype.
	 * @param {BEApiQueueBaseMethod} def The method class.
	 */
	static register(taskName, def) {
		if (taskName && typeof BEApiQueue.prototype[taskName] !== 'undefined') {
			throw 'Reserved method';
		}

		BEApiQueue.tasks = BEApiQueue.tasks || {};
		BEApiQueue.tasks[taskName] = def;

		(function (method) {
			BEApiQueue.prototype[method] = function (...args) {
				this.add(new BEApiQueueTask(method, args));
				return this;
			}
		})(taskName);
	}

	static __noop() {}
}

/**
 * Abstract class for `BEApiQueue Method`s.
 * @class
 */
export class BEApiQueueBaseMethod {

	/**
	 * The HTTP method of the request.
	 * @type {String}
	 * @default 'get'
	 */
	get type() {
		return 'get';
	}

	/**
	 * Initialize a `BEApiQueue Method`.
	 * @constructor
	 */
	constructor(options = {}) {
		this.options = options;
	}

	/**
	 * Arguments input processor.
	 * @param {Object} scope The scope for the queue.
	 * @param {*} args All the arguments passed to the method when invoked in queue.
	 * @return {Promise} A promise resolved when all inputs are processed.
	 */
	input(scope, ...args) {
		return new Promise((resolve) => {
			resolve(args);
		});
	}

	/**
	 * Validate the result of a request response.
	 * @param {Object} res The request response.
	 * @return {Promise} A promise resolved when the response is validated.
	 */
	validate(res) {
		return new Promise((resolve, reject) => {
			if (res && res.data && (!res.status || (res.status >= 200 && res.status < 300))) {
				resolve();
			} else {
				reject();
			}
		});
	}

	/**
	 * Transform the result of a request response.
	 * @param {Object} scope The scope for the queue.
	 * @param {Object} res The request response.
	 * @return {Promise} A promise resolved when scope changes are finished.
	 */
	transform(scope, res) {
		return new Promise((resolve) => {
			resolve(scope);
		});
	}

}
