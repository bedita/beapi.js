/**
 * @class BEApiRegistry
 * @classdesc A registry of BEApi configuration.
 * Everywhere, in your JavaScript application, you can use `BEApiRegistry.get(key)` to retrieve a BEApi configration.
 * Register BEApi configurations is lighter and simpler than register instances.
 * Use BEApiRegistry to share configuration between models, interfaces and queues.
 */
export class BEApiRegistry {

	/**
	 * Add a configuration using the provided key.
	 * @param {String} key The key to use to register the configuration.
	 * @param {Object} conf The configuration.
	 */
	static add(key, conf = {}) {
		BEApiRegistry._instances = BEApiRegistry._instances || {};
		BEApiRegistry._instances[key] = conf;
	}

	/**
	 * Retrieve a configuration using the provided key.
	 * @param {String} key The key to use to read the configuration.
	 * @return {Object} The configuration.
	 */
	static get(key) {
		BEApiRegistry._instances = BEApiRegistry._instances || {};
		if (typeof BEApiRegistry._instances[key] !== 'undefined') {
			return BEApiRegistry._instances[key];
		}
	}

	/**
	 * Remove a configuration using the provided key.
	 * @param {String} key The key to use to remove the configuration.
	 * @return {Boolean} If the configuration exists, return `true` after remotion, otherwise return `false`.
	 */
	static remove(key) {
		BEApiRegistry._instances = BEApiRegistry._instances || {};
		if (typeof BEApiRegistry._instances[key] !== 'undefined') {
			delete BEApiRegistry._instances[key];
			return true;
		}
		return false;
	}

}
