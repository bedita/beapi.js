import { BEArray } from './model.next.js';
import { BEApi } from './beapi.next.js';
import { BEApiQueue } from './beapi.queue.next.js';
import './methods/all.next.js';

export class BECollection extends BEArray {

	constructor(options = {}, conf = {}) {
		super([], conf);
		var items;
        if (options.alias) {
            this.alias = options.alias;
			if (options.filter) {
				items = options.alias.filter(options.filter) || [];
			} else {
				items = options.alias.items || [];
			}
        } else {
			items = options.items || options.objects || [];
		}
        this.url = options.url;
		for (let i = 0; i < items.length; i++) {
			this.push(items[i]);
		}
		if (items.length < options.count) {
			this.push({});
		}
    }

	push(obj) {
		if (!(obj instanceof BEObject)) {
			obj = new BEObject(obj, this.conf);
		}
		Array.prototype.push.call(this, obj);
	}

    fetch(url) {
        var that = this;
        return new Promise(function(resolve, reject) {
            if (that.url || url) {
                if (that.alias) {
                    return that.alias.fetch(that.url || url || undefined);
                }
				that.splice(0, that.length);
				var beapi = new BEApi(that.conf);
                beapi.get(that.url || url).then(function(res) {
                    if (res && res.data && res.data.objects) {
                        for (var i = 0; i < res.data.objects.length; i++) {
                            var obj = res.data.objects[i];
							that.push(obj);
                        }
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

	filter(f) {
		return Array.prototype.filter.call(this, function(item) {
			return item.is(f);
		});
	}
}
