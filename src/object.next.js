import { BEModel } from './model.next.js';
import { BEApi } from './beapi.next.js';
import { BEApiQueue } from './beapi.queue.next.js';
import './methods/all.next.js';

var isoDateRegex = /\d{4,}\-\d{2,}\-\d{2,}T\d{2,}:\d{2,}:\d{2,}\+\d{4,}/;

/**
 * A generic model for BE objects.
 * @class
 */
export class BEObject extends BEModel {

	/**
	 * Set up the model.
	 * @see {@link BEModel.constructor}.
	 * @param {Object} data The initial data to set.
	 * @param {Object} conf An optional set of configuration params.
	 * @constructor
	 */
	constructor(data = {}, conf) {
		super(conf);
        this.set(data);
    }

	/**
	 * Perform a BEApi request to populate the model.
	 * If the current model has not a valid ID or a valid nickname, reject the promise.
	 * At the end of the request, automatically set fetched data.
	 * @return {Promise}
	 */
    fetch() {
        var that = this;
        return new Promise(function(resolve, reject) {
            if (that.id || that.nickname) {
                var promise = new BEApi(that._config()).get('objects/' + (that.id || that.nickname));
                promise.then(function(res) {
                    if (res && res.data && res.data.object) {
                        that.set(res.data.object);
						that._modified(false);
                    } else {
						reject(res);
					}
                }, function (err) {
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
	save(data = {}) {
		var that = this;
		that.set(data);
		var dataToSend = that.toJSON( that._modified() );
			dataToSend.id = that.id,
			dataToSend.nickname = that.nickname;
		return new Promise(function(resolve, reject) {
			var promise = new BEApi(that._config()).post('objects', {
				data: dataToSend
			});
            promise.then(function(res) {
                if (res && res.data && res.data.object) {
                    that.set(res.data.object);
					that._modified(false);
					resolve(res);
                } else {
					reject(res);
				}
            }, function (err) {
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
	create(data = {}) {
		if (!this.isNew()) {
			throw 'Object already created.';
		}
		return this.save(data);
	}

	/**
	 * Perform a BEApi request to delete the object.
	 * @throws If the model has not a valid ID or a valid nickname.
	 * @return {Promise}
	 */
	remove() {
		var that = this;
		if (this.isNew()) {
			throw 'Object has not a valid ID or a valid nickname.';
		}
		return new Promise(function(resolve, reject) {
			var promise = new BEApi(that._config()).delete('objects/' + (that.id || that.nickname));
            promise.then(function(res) {
                resolve();
            }, function (err) {
				reject(err);
            });
		});
	}

	/**
	 * Clone the model.
	 * @return {BEObject} The clone model.
	 */
	clone() {
		return new BEObject(this.toJSON([], ['id']), this._config());
	}

	/**
	 * Check if the model is new (client-side created).
	 * @return {Boolean}
	 */
	isNew() {
		return (!this.id && !this.nickname);
	}

	/**
	 * Set data to the model.
	 * Automatically create BECollection for children and relations.* fields.
	 * Automatically create a BEObject for the parent if `parent_id` is specified.
	 * Automatically convert ISO string dates into {Date} objects.
	 * Add to the `__modified` the key that needs to be sync with the server.
	 * @param {Object|String} data A set of data to set or a key to update.
	 * @param {*} value The value to set to the `data` key string.
	 * @return {BEObject} The instance.
	 */
    set(data = {}, value) {
		if (value !== undefined && typeof data == 'string') {
			var key = data;
			data = {};
			data[key] = value;
		}
        var that = this;
        var relations = data.relations || {};
        var children = data.children || {};

		// iterate relations and create BECollection for each key
        for (var k in relations) {
            if (!that.relations) {
                that.relations = {};
            }
            defineRelation(k, relations[k]);
        }

        function defineRelation(name, options) {
            that.relations[name] = new BECollection(options, that._config());
        }

		// create a BECollection for the `children` field
        if (children && !this.children) {
            this.children = new BECollection({
                url: children.url,
                count: children.count
            }, that._config());
            if (children.sections) {
                this.sections = new BECollection({
                    alias: this.children,
                    filter: {
                        object_type: 'Section'
                    },
                    url: children.sections.url,
                    count: children.sections
                }, that._config());
            }
        }

        for (var k in data) {
            var d = data[k];
            //check if iso date
            if (typeof d == 'string' && d.length == 24 && isoDateRegex.test(d)) {
                var convert = new Date(d);
                if (!isNaN(convert.valueOf())) {
                    d = convert;
                }
            }
			// add to modified list
            if (that[k] !== d) {
                that[k] = d;
				this._modified(k);
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

        return that;
    }

	/**
	 * Check if the model match a filter.
	 * @param {Object|String|RegExp} filter The filter to use. Could be any dataset, a simple string, or a regular expression.
	 * @return {Boolean}
	 */
    is(filter) {
		var data = this.toJSON();
		if (filter instanceof RegExp) {
			for (var k in data) {
				if (data[k].match(filter)) {
					return true;
				}
			}
        } else if (typeof filter == 'string') {
			var regex = new RegExp(filter);
			for (var k in data) {
				if (data[k].match(regex)) {
					return true;
				}
			}
		} else if (typeof filter == 'object') {
            for (var k in filter) {
                if (filter[k] !== data[k]) {
                    return false;
                }
            }
            return true;
		}
        return false;
    }

	query() {
		var that = this;
		var queue = new BEApiQueue(this._config());
		if ('id' in this && 'nickname' in this) {
			queue.identity(this);
		} else {
			queue.objects(this.id || this.nickname);
		}
		queue.all(function (scope) {
			that.set(scope);
			that._modified(false);
		});
		return queue;
	}

	toJSON(keep, remove) {
		var res = {},
			data = this;

		if (!Array.isArray(keep)) {
			keep = [];
		}
		if (!Array.isArray(remove)) {
			remove = [];
		}
		for (var k in data) {
			if (BEObject.unsetFromData.indexOf(k) === -1 && typeof data[k] !== 'function' && (!keep || !keep.length || keep.indexOf(k) !== -1) && (!remove || !remove.length || remove.indexOf(k) === -1)) {
				res[k] = data[k];
			}
		}
		return res;
	}

	static get unsetFromData() {
		return ['__modified', '__config'];
	}

}
