import { BEModel } from './model.next.js';
import { BEApi } from './beapi.next.js';
import { BEApiQueue } from './beapi.queue.next.js';
import './methods/all.next.js';

var isoDateRegex = /\d{4,}\-\d{2,}\-\d{2,}T\d{2,}:\d{2,}:\d{2,}\+\d{4,}/;

export class BEObject extends BEModel {

	constructor(data = {}, conf = {}) {
		super(conf);
        this.set(data);
    }

    fetch() {
        var that = this;
        return new Promise(function(resolve, reject) {
            if (that.id) {
                var promise = new BEApi(that.conf).get('objects/' + that.id);
                promise.then(function(res) {
                    if (res && res.data && res.data.object) {
                        that.set(res.data.object);
                    }
                });
                return promise;
            } else {
                reject();
            }
        });
    }

    set(data) {
        var that = this;
        var relations = data.relations || {};
        var children = data.children || {};
        var relationList = data.relations ? {} : false;
        var childrenList = data.children ? {} : false;

        var defineRelation = function(name, options) {
            that.relations[name] = new BECollection(options, that.conf);
        }

        for (var k in relations) {
            if (!that.relations) {
                that.relations = {};
            }
            defineRelation(k, relations[k]);
        }

        if (children && !this.children) {
            this.children = new BECollection({
                url: children.url,
                count: children.count
            }, that.conf);
            if (children.sections) {
                this.sections = new BECollection({
                    alias: this.children,
                    filter: {
                        object_type: 'Section'
                    },
                    url: children.sections.url,
                    count: children.sections
                }, that.conf);
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
            if (that[k] !== d) {
                that[k] = d;
            }
        }

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

    is(filter) {
        if (typeof filter == 'object') {
            for (var k in filter) {
                if (filter[k] !== this[k]) {
                    return false;
                }
            }
            return true;
        }
        return false;
    }

	query() {
		var that = this;
		var queue = new BEApiQueue(this.conf);
		if ('id' in this && 'nickname' in this) {
			queue.identity(this);
		} else {
			queue.objects(this.id || this.nickname);
		}
		queue.all(function (scope) {
			that.set(scope);
		});
		return queue;
	}

}
