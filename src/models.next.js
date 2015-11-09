/**
 * @class BEModel
 * @classdesc A base model for BE objects.
 *
 * @description Instantiate config properties.
 * @param {Object} conf A configuration set.
 */
export class BEModel {

	constructor(conf = {}) {
		this.$udid = BEModel.generateId();
		this.$modified = [];
		this.$config = conf;
	}

	/**
	 * Get the client registry ID.
	 * @return {String|Number} The client registry ID.
	 */
	$id() {
		return this.$udid;
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
				if ((!keep || keep.length == 0 || keep.indexOf(k) !== -1) && (!remove || remove.length == 0 || remove.indexOf(k) == -1)) {
					res[k] = data[k];
				}
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

	constructor(items = [], conf = {}) {
		super(items);
		this.$udid = BEModel.generateId();
		this.$config = conf;
	}

	/**
	 * Get the client registry ID.
	 * @return {String|Number} The client registry ID.
	 */
	$id() {
		return BEModel.prototype.$id.call(this);
	}
}
