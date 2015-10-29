import { BEModel } from './models.nextjs';
import { BEApi } from './beapi.next.js';
import { BEApiQueue } from './beapi.queue.next.js';
import './methods/all.next.js';

/**
 * @class BEObject
 * @classdesc A generic model for BE objects.
 *
 * @description Set up the model.
 * see {@link BEModel.constructor}.
 * @param {Object} data The initial data to set.
 * @param {Object} conf An optional set of configuration params.
 */
export class BEObject extends BEModel {

	constructor(data = {}, conf) {
		super(conf);
		BEModel.updateRegistry(this, 'collections', []);
        this.$set(data);
    }

	/**
	 * Perform a BEApi request to populate the model.
	 * If the current model has not a valid ID or a valid nickname, reject the promise.
	 * At the end of the request, automatically set fetched data.
	 * @return {Promise}
	 */
    $fetch() {
        return new Promise((resolve, reject) => {
            if (this.id || this.nickname) {
                let promise = new BEApi(this.$config()).get('objects/' + (this.id || this.nickname));
                promise.then((res) => {
                    if (res && res.data && res.data.object) {
                        this.$set(res.data.object);
						this.$modified(false);
						resolve(res);
                    } else {
						reject(res);
					}
                }, (err) => {
					reject(err);
                });
                return promise;
            } else {
                reject();
            }
        });
    }

	/**
	 * Perform a BEApi request to sync the model with the server.
	 * If the current model has not a valid ID or a valid nickname, a new object will be created.
	 * At the end of the request, automatically set new fetched data.
	 * @param {Object} data Optional data to set before save.
	 * @return {Promise}
	 */
	$save(data = {}) {
		this.$set(data);
		let dataToSend = this.$toJSON( this.$modified() );
			dataToSend.id = this.id,
			dataToSend.nickname = this.nickname;
		return new Promise((resolve, reject) => {
			let promise = new BEApi(this.$config()).post('objects', {
				data: dataToSend
			});
            promise.then((res) => {
                if (res && res.data && res.data.object) {
                    this.$set(res.data.object);
					this.$modified(false);
					resolve(res);
                } else {
					reject(res);
				}
            }, (err) => {
				reject(err);
            });
        });
	}

	/**
	 * A {@link BEObject.save} wrapper for object creation.
	 * @throws If the model already has a valid ID.
	 * @param {Object} data Optional data to set before creation.
	 * @return {Promise}
	 */
	$create(data = {}) {
		if (!this.$isNew()) {
			throw 'Object already created.';
		}
		return this.$save(data);
	}

	/**
	 * Perform a BEApi request to delete the object.
	 * @throws If the model has not a valid ID or a valid nickname.
	 * @return {Promise}
	 */
	$remove() {
		let promise = new Promise((resolve, reject) => {
			if (!this.$isNew()) {
				let promise = new BEApi(this.$config()).delete('objects/' + (this.id || this.nickname));
	            promise.then((res) => {
	                resolve();
	            }, (err) => {
					reject(err);
	            });
			} else {
				resolve();
			}
		});

		promise.then(() => {
			let collections = BEModel.readRegistry(this, 'collections');
			collections.forEach((collection) => {
				let io = collection.indexOf(this);
				if (io !== -1) {
					collection.splice(io, 1);
				}
			});
			BEModel.prototype.$remove.call(this);
		});

		return promise;
	}

	/**
	 * Clone the model.
	 * @return {BEObject} The clone model.
	 */
	$clone() {
		return new BEObject(this.$toJSON([], ['id']), this.$config());
	}

	/**
	 * Check if the model is new (client-side created).
	 * @return {Boolean}
	 */
	$isNew() {
		return (!this.id && !this.nickname);
	}

	/**
	 * Set data to the model.
	 * Automatically create BECollection for children and relations.* fields.
	 * Automatically create a BEObject for the parent if `parent_id` is specified.
	 * Automatically convert ISO string dates into {Date} objects.
	 * Add to the `_modified` the key that needs to be sync with the server.
	 * @param {Object|String} data A set of data to set or a key to update.
	 * @param {*} value The value to set to the `data` key string.
	 * @return {BEObject} The instance.
	 */
    $set(data = {}, value) {
		if (value !== undefined && typeof data == 'string') {
			let key = data;
			data = {};
			data[key] = value;
		}
        let relations = data.relations || {};
        let children = data.children || {};
		let isoDateRegex = /\d{4,}\-\d{2,}\-\d{2,}T\d{2,}:\d{2,}:\d{2,}\+\d{4,}/;

		// iterate relations and create BECollection for each key
        for (let k in relations) {
            if (!this.relations) {
                this.relations = {};
            }
			this.relations[k] = new BECollection(relations[k], this.$config());
        }

		// create a BECollection for the `children` field
        if (children && !this.children) {
            this.children = new BECollection({
                url: children.url,
                count: children.count
            }, this.$config());
            if (children.sections) {
                this.sections = new BECollection({
                    alias: this.children,
                    filter: {
                        object_type: 'Section'
                    },
                    url: children.sections.url,
                    count: children.sections
                }, this.$config());
            }
        }

        for (let k in data) {
            let d = data[k];
            //check if iso date
            if (typeof d == 'string' && d.length == 24 && isoDateRegex.test(d)) {
                let convert = new Date(d);
                if (!isNaN(convert.valueOf())) {
                    d = convert;
                }
            }
			// add to modified list
            if (this[k] !== d) {
                this[k] = d;
				this.$modified(k);
            }
        }

		// create a BEObject for the parent if the defined
        if (data.parent_id) {
            this.parent = new BEObject({
                id: data.parent_id
            });
            delete this.parent_id;
        } else {
            delete this.parent;
        }

        return this;
    }

	/**
	 * Check if the model match a filter.
	 * @param {Object|String|RegExp} filter The filter to use. Could be any dataset, a simple string, or a regular expression.
	 * @return {Boolean}
	 */
    $is(filter) {
		let data = this.$toJSON();
		if (filter instanceof RegExp) {
			for (let k in data) {
				if (data[k].match(filter)) {
					return true;
				}
			}
        } else if (typeof filter == 'string') {
			let regex = new RegExp(filter);
			for (let k in data) {
				if (data[k].match(regex)) {
					return true;
				}
			}
		} else if (typeof filter == 'object') {
            for (let k in filter) {
                if (filter[k] !== data[k]) {
                    return false;
                }
            }
            return true;
		}
        return false;
    }

	/**
	 * Start a query thread for the current Object instance.
	 * @return {BEApiQueue} A `BEApiQueue` instance scoped with the current Object.
	 */
	$query() {
		let queue = new BEApiQueue(this.$config());
		if ('id' in this && 'nickname' in this) {
			queue.identity(this);
		} else {
			queue.objects(this.id || this.nickname);
		}
		queue.all((scope) => {
			this.$set(scope);
			this.$modified(false);
		});
		return queue;
	}

}
