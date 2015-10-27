import { BEArray } from './models.nextjs';
import { BEApi } from './beapi.next.js';

/**
 * @class BECollection
 * @classdesc A generic model for BE collections.
 */
export class BECollection extends BEArray {

	constructor(options = {}, conf = {}) {
		super([], conf);
		let items = [];
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
			obj = new BEObject(obj, this._config());
		}
		Array.prototype.push.call(this, obj);
	}

    fetch(url) {
        return new Promise((resolve, reject) => {
            if (this.url || url) {
                if (this.alias) {
                    return this.alias.fetch(this.url || url || undefined);
                }
				this.splice(0, this.length);
				let beapi = new BEApi(this._config());
                beapi.get(this.url || url).then((res) => {
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

	filter(f) {
		return Array.prototype.filter.call(this, (item) => item.is(f));
	}

	toArray() {
		return Array.prototype.slice.call(this, 0);
	}
}
