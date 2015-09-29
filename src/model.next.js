/**
 * A base model to handle BE objects.
 * @class
 */
export class BEModel {
	/**
	 * Instantiate config properties.
	 * @param {Object} conf A configuration set.
	 * @constructor
	 */
	constructor(conf) {
		this.__config = conf;
		this.__modified = [];
	}

	/**
	 * Get or set configuration params.
	 * @param {Object} conf An optional set of configuration params.
	 * @return {Object} The current configuration set.
	 */
	_config(conf) {
		if (conf) {
			this.__config = conf;
		}
		return this.__config;
	}

	/**
	 * Get a list of fields that need to sync with the server or add e new one.
	 * @param {String|Boolean} key An optional field name which needs to be synced. If `false` is passed, the array will be resetted.
	 * @return {Array} A list of fields which need to be synced.
	 */
	_modified(key) {
		if (key === false) {
			this.__modified = [];
		} else if (key && this.__modified.indexOf(key) === -1) {
			this.__modified.push(key);
		}
		return this.__modified;
	}

}

/**
 * A base model to handle BE collections.
 * @class
 */
export class BEArray extends Array {
	/**
	 * Instantiate items and config properties.
	 * @param {Array} items A list of `BEModel` objects.
	 * @param {Object} conf A configuration set.
	 * @constructor
	 */
	constructor(items, conf) {
		super(items);
		this.__config = conf;
	}

	/**
	 * Get or set configuration params.
	 * @param {Object} conf An optional set of configuration params.
	 * @return {Object} The current configuration set.
	 */
	_config(conf) {
		if (conf) {
			this.__config = conf;
		}
		return this.__config;
	}

	/**
	 * Get a list of fields that need to sync with the server or add e new one.
	 * @param {String|Boolean} key An optional field name which needs to be synced. If `false` is passed, the array will be resetted.
	 * @return {Array} A list of fields which need to be synced.
	 */
	_modified(key) {
		if (key === false) {
			this.__modified = [];
		} else if (key && this.__modified.indexOf(key) === -1) {
			this.__modified.push(key);
		}
		return this.__modified;
	}

}
