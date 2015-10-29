import { BEArray } from './models.nextjs';
import { BEApi } from './beapi.next.js';

/**
 * @class BECollection
 * @classdesc A generic model for BE collections.
 *
 * @description Instantiate a BECollection Array.
 * @param {String|Array|Object} data If `String` case, it's the endpoint to fetch. If `Array`, it's the initial state of the collection. If `Object`, it's an object with `<array>items` and `<number>count` fields (in case of pagination).
 * @param {Object} conf An optional set of BEApi configuration params.
 */
export class BECollection extends BEArray {

	constructor(data = [], conf = {}) {
		let items = [];
		if (typeof items == 'object') {
			items = data.items || [];
		} else if (Array.isArray(data)) {
			items = data;
		}
		for (let i = 0; i < items.length; i++) {
			if (!(items[i] instanceof BEObject)) {
				items[i] = new BEObject(items[i], conf);
			}
		}
		super(items, conf);
		if (typeof data == 'string') {
			this.$url = data;
		} else if (typeof items == 'object' && data.count) {
			if (items.length < data.count) {
				this.push(new BEObject({}, conf));
			}
		}
		this.forEach((obj) => {
			let collections = BEModel.readRegistry(obj, 'collections') || [];
			collections.push(this);
			BEModel.updateRegistry(obj, 'collections', collections);
		});
    }

	/**
	 * Extend `Array.prototype.push`. Same input/output. Automatically transform plain objects in BEObject instances.
	 * (see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/push})
	 */
	push(...objects) {
		objects.forEach((obj) => {
			if (!(obj instanceof BEObject)) {
				obj = new BEObject(obj, this.$config());
			}
			if (this.indexOf(obj) == -1) {
				this.__addCollectionToObject(obj);
				Array.prototype.push.call(this, obj);
			}
		});
		return this.length;
	}

	/**
	 * Extend `Array.prototype.pop`. Same input/output.
	 * (see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/pop})
	 */
	pop(...args) {
		let obj = Array.prototype.splice.apply(this, args);
		this.__removeCollectionFromObject(obj);
		return obj;
	}

	/**
	 * Extend `Array.prototype.shift`. Same input/output.
	 * (see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/shift})
	 */
	shift(...args) {
		let obj = Array.prototype.shift.apply(this, args);
		this.__removeCollectionFromObject(obj);
		return obj;
	}

	/**
	 * Extend `Array.prototype.splice`. Same input/output.
	 * (see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/shift})
	 */
	splice(...args) {
		let removed = Array.prototype.splice.apply(this, args);
		if (removed) {
			removed.forEach((obj) => {
				this.__removeCollectionFromObject(obj);
			});
		}
		return removed;
	}

	/**
	 * Create a relation between the BECollection and its BEObject.
	 * @private
	 * @param {BEObject} obj The model to associate.
	 * @return {Boolean} The relation has been created.
	 */
	__addCollectionToObject(obj) {
		let collections = BEModel.readRegistry(obj, 'collections') || [];
		let io = collections.indexOf(this);
		if (io == -1) {
			collections.push(this);
			BEModel.updateRegistry(obj, 'collections', collections);
			return true;
		}
		return false;
	}

	/**
	 * Remove a relation between the BECollection and its BEObject.
	 * @private
	 * @param {BEObject} obj The model to unassociate.
	 * @return {Boolean} The relation has been removed.
	 */
	__removeCollectionFromObject(obj) {
		let collections = BEModel.readRegistry(obj, 'collections') || [];
		let io = collections.indexOf(this);
		if (io !== -1) {
			collections.splice(io, 1);
			BEModel.updateRegistry(obj, 'collections', collections);
			return true;
		}
		return false;
	}

	/**
	 * Perform a BEApi request to populate the collection.
	 * If the current model has not a valid url, reject the promise.
	 * At the end of the request, automatically set fetched items.
	 * @param {String} url The endpoint to fetch.
	 * @return {Promise}
	 */
    $fetch(url) {
        return new Promise((resolve, reject) => {
            if (this.$url || url) {
				if (url) {
					this.$url = url;
				}
				let beapi = new BEApi(this.$config());
                beapi.get(this.$url).then((res) => {
                    if (res && res.data && res.data.objects) {
                        for (let i = 0; i < res.data.objects.length; i++) {
                            let obj = res.data.objects[i];
							this.push(obj);
                        }
                    }
                    resolve.apply(this, arguments);
                }, (err) => {
                    reject.apply(this, arguments);
                });
            } else {
                reject();
            }
        });
    }

	/**
	 * Perform a filter on a BECollection.
	 * @param {Object} filter A plain object to match.
	 * @return {Array}
	 */
	$filter(filter) {
		return Array.prototype.filter.call(this, (item) => item.$is(filter));
	}

	/**
	 * Convert a BECollection into a plain array.
	 * @return {Array}
	 */
	$toArray() {
		return Array.prototype.slice.call(this, 0);
	}
}
