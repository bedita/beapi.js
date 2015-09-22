export class BEModel {

	constructor(conf) {
		this.conf = conf;
	}

	config(conf) {
		this.conf = conf;
	}

}

export class BEArray extends Array {

	constructor(items, conf) {
		super(items);
		this.conf = conf;
	}

	config(conf) {
		this.conf = conf;
	}

}
