import { BEModel } from './model.next.js';
import { BEApi } from './beapi.next.js';
import { BEApiQueue } from './beapi.queue.next.js';
import './methods/all.next.js';

export class BECollection extends BEModel {

	constructor(options = {}, conf = {}) {
		super(conf);
        if (options.alias) {
            this.alias = options.alias;
			if (options.filter) {
				this.items = options.alias.filter(options.filter) || [];
			} else {
				this.items = options.alias.items || [];
			}
        } else {
			this.items = options.items || options.objects || [];
		}
        this.url = options.url;
        this.length = options.count || this.items.length || 0;
		this.update();
    }

	update() {
		var that = this;
		this.forEach(function (obj, index) {
			if (!(obj instanceof BEObject)) {
				obj = new BEObject(obj, that.conf);
				that.items[index] = obj;
			}
			that[index] = obj;
		});
	}

    fetch(url) {
        var that = this;
        return new Promise(function(resolve, reject) {
            if (that.url || url) {
                if (that.alias) {
                    return that.alias.fetch(that.url || url || undefined);
                }
				var oldLength = that.length;
				for (let z = 0; z < oldLength; z++) {
					delete that[z];
				}
				var beapi = new BEApi(that.conf);
                beapi.get(that.url || url).then(function(res) {
                    if (res && res.data && res.data.objects) {
                        for (var i = 0; i < res.data.objects.length; i++) {
                            var obj = res.data.objects[i];
                            that.items[i] = new BEObject(obj, that.conf);
                        }
                        that.items.slice(res.data.objects.length);
                        that.length = that.items.length;
						that.update();
                    }
                    resolve.apply(this, arguments);
                }, function() {
                    reject.apply(this, arguments);
                });
            } else {
                reject();
            }
        });
    }

    forEach(callback) {
        if (typeof callback !== 'function') {
            return;
        }
        var that = this;
        for (let i = 0, len = this.length; i < len; i++) {
            callback.call(that, that.item(i), i);
        }
    }

	item(index) {
		return this.items[index];
	}

    filter(f) {
        return this.items.filter(function(item) {
            return item.is(f);
        });
    }

}
