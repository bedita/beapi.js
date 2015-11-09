/**
 * @class BEModel
 * @classdesc A base model for BE objects.
 *
 * @description Instantiate config properties.
 * @param {Object} conf A configuration set.
 */
export class BEModel {

	constructor(conf = {}) {
		this.$udid = BEModel.uid();
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
     * Add a callbacks for the specified trigger.
     *
     * @param {String} name The event name
     * @param {Function} callback The callback function
     * @return {Function} Destroy created listener with this function
     */
    $on(name, callback) {
		let obj = this;
        if (typeof callback == 'function') {
            let objCallbacks = this.$callbacks = this.$callbacks || {};
            let evtCallbacks = objCallbacks[name] = objCallbacks[name] || { 'length': 0 };
            let len = evtCallbacks.length;
            evtCallbacks[len] = {
                fn: callback,
                destroy: (function(callbacks, id) {
                    return function() {
                        if (typeof callbacks[id] !== undefined) {
                            delete callbacks[id];
                        }
                    }
                }.bind(this))(objCallbacks[name], len)
            }
            evtCallbacks.length += 1;
            return this.$callbacks[name][len].destroy;
        }
    }

	/**
     * Remove all listeners.
     *
     * @param {String} name Optional event name to reset
     */
    $off(name) {
        let callbacks = this.$callbacks;
        if (callbacks && name && callbacks[name]) {
            let clbs = callbacks[name];
            for (let i in clbs) {
                if (typeof clbs[i] === 'object' && typeof clbs[i].destroy === 'function') {
                    clbs[i].destroy.call(this);
                }
            }
        } else {
        	this.$callbacks = {};
		}
    }

	/**
     * Trigger a callback.
     *
     * @param {*} obj The object that triggers events
     * @param {String} name Event name
     * @param {Array} ...args Arguments to pass to callback functions
     * @exec callback functions
     */
    $trigger(name, ...args) {
        let objCallbacks = this.$callbacks || {};
        let evtCallbacks = objCallbacks[name] || {};
        for (let k in evtCallbacks) {
            let clb = evtCallbacks[k];
            if (typeof clb === 'object' && typeof clb.fn === 'function') {
                clb.fn.apply(this, args);
            }
        }
    }

	/**
	 * Generate an unique id.
	 * @static
	 * @return {String|Number} An unique id.
	 */
	static uid() {
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
		this.$udid = BEModel.uid();
		this.$config = conf;
	}

	/**
     * Add a callbacks for the specified trigger.
     *
     * @param {String} name The event name
     * @param {Function} callback The callback function
     * @return {Function} Destroy created listener with this function
     */
    $on(name, callback) {
		return BEModel.prototype.$on.call(this);
	}

	/**
     * Remove all listeners.
     *
     * @param {String} name Optional event name to reset
     */
    $off(name = null) {
		return BEModel.prototype.$off.call(this);
	}

	/**
     * Trigger a callback.
     *
     * @param {*} obj The object that triggers events
     * @param {String} name Event name
     * @param {Array} ...args Arguments to pass to callback functions
     * @exec callback functions
     */
    $trigger(name, ...args) {
		return BEModel.prototype.$trigger.call(this);
	}

	/**
	 * Get the client registry ID.
	 * @return {String|Number} The client registry ID.
	 */
	$id() {
		return BEModel.prototype.$id.call(this);
	}
}
