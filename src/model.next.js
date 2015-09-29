export class BEModel {

	constructor(conf) {
		this.__config = conf;
		this.__modified = [];
	}

	_config(conf) {
		if (conf) {
			this.__config = conf;
		}
		return this.__config;
	}

	_modified(key) {
		if (key === false) {
			this.__modified = [];
		} else if (key && this.__modified.indexOf(key) === -1) {
			this.__modified.push(key);
		}
		return this.__modified;
	}

	static get unsetFromData() {
		return ['__modified', '__config'];
	}

}

export class BEArray extends Array {

	constructor(items, conf) {
		super(items);
		this.__config = conf;
	}

	_config(conf) {
		if (conf) {
			this.__config = conf;
		}
		return this.__config;
	}

	_modified(key) {
		if (key === false) {
			this.__modified = [];
		} else if (key && this.__modified.indexOf(key) === -1) {
			this.__modified.push(key);
		}
		return this.__modified;
	}

	static get unsetFromData() {
		return ['__modified', '__config'];
	}

}
