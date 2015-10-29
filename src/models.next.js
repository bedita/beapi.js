/**
 * @class BEModel
 * @classdesc A base model for BE objects.
 *
 * @description Instantiate config properties.
 * @param {Object} conf A configuration set.
 */
export class BEModel {

	constructor(conf) {
		this.$udid = BEModel.generateId();
		BEModel.updateRegistry(this, 'conf', conf);
		BEModel.updateRegistry(this, 'modified', []);
	}

	/**
	 * Get the client registry ID.
	 * @return {String|Number} The client registry ID.
	 */
	$id() {
		return this.$udid;
	}

	/**
	 * Get or set configuration params.
	 * @param {Object} conf An optional set of configuration params.
	 * @return {Object} The current configuration set.
	 */
	$config(conf) {
		if (conf) {
			return BEModel.updateRegistry(this, 'conf', conf);
		}
		return BEModel.readRegistry(this, 'conf') || {};
	}

	/**
	 * Get a list of fields that need to sync with the server or add e new one.
	 * @param {String|Boolean} key An optional field name which needs to be synced. If `false` is passed, the array will be resetted.
	 * @return {Array} A list of fields which need to be synced.
	 */
	$modified(key) {
		let modified = BEModel.readRegistry(this, 'modified') || [];
		if (key === false) {
			return BEModel.updateRegistry(this, 'modified', []);
		} else if (key && modified.indexOf(key) === -1) {
			modified.push(key);
			return BEModel.updateRegistry(this, 'modified', modified);
		}
		return BEModel.readRegistry(this, 'modified');
	}

	/**
	 * Destroy a model and remove its references from the registry.
	 * @return {Boolean} The model has actually been removed.
	 */
	$remove() {
		return BEModel.removeFromRegistry(this);
	}

	/**
	 * Returns a plain javascript object with the model data.
	 * @return {Object}
	 */
	$toJSON(keep, remove) {
		let res = {},
			data = this;

		if (!Array.isArray(keep)) {
			keep = [];
		}
		if (!Array.isArray(remove)) {
			remove = [];
		}
		for (let k in data) {
			if (k[0] !== '$') {
				res[k] = data[k];
			}
		}
		return res;
	}

	/**
	 * Generate an unique id.
	 * @static
	 * @return {String|Number} An unique id.
	 */
	static generateId() {
		this.__generated = this.__generated || 0;
		let id = '$' + this.__generated;
		this.__generated += 1;
		return id;
	}

	/**
	 * Read a value stored in the registry for a specific model.
	 * @static
	 * @param {Object|String|Number} The model or its registry id.
	 * @return {*} The stored value.
	 */
	static readRegistry(obj, key) {
		this.registry = this.registry || {};
		let udid = (typeof obj.$id === 'function') ? obj.$id() : obj;
		if (udid) {
			this.registry[udid] = this.registry[udid] || {};
			return this.registry[udid][key];
		}
	}

	/**
	 * Update a value stored in the registry for a specific model.
	 * @static
	 * @param {Object|String|Number} The model or its registry id.
	 * @return {*} The stored value.
	 */
	static updateRegistry(obj, key, value) {
		this.registry = this.registry || {};
		let udid = (typeof obj.$id === 'function') ? obj.$id() : obj;
		if (udid) {
			this.registry[udid] = this.registry[udid] || {};
			this.registry[udid][key] = value;
			return value;
		}
	}

	/**
	 * Remove a model entry from the registry.
	 * @static
	 * @param {Object|String|Number} The model or its registry id.
	 */
	static removeFromRegistry(obj) {
		this.registry = this.registry || {};
		let udid = (typeof obj.$id === 'function') ? obj.$id() : obj;
		if (udid) {
			delete this.registry[udid];
		}
	}

}

/**
 * @class BEArray
 * @classdesc A base model for BE collections.
 *
 * @description Instantiate items and config properties.
 * @param {Array} items A list of `BEModel` objects.
 * @param {Object} conf A configuration set.
 */
export class BEArray extends Array {

	constructor(items = [], conf) {
		super(items);
		this.$udid = BEModel.generateId();
		BEModel.updateRegistry(this, 'conf', conf);
	}

	/**
	 * Get the client registry ID.
	 * @return {String|Number} The client registry ID.
	 */
	$id() {
		return BEModel.prototype.$id.call(this);
	}

	/**
	 * Get or set configuration params.
	 * @param {Object} conf An optional set of configuration params.
	 * @return {Object} The current configuration set.
	 */
	$config(conf) {
		return BEModel.prototype.$config.call(this, conf);
	}

	/**
	 * Get a list of fields that need to sync with the server or add e new one.
	 * @param {String|Boolean} key An optional field name which needs to be synced. If `false` is passed, the array will be resetted.
	 * @return {Array} A list of fields which need to be synced.
	 */
	$modified(key) {
		return BEModel.prototype.$modified.call(this, key);
	}
}
