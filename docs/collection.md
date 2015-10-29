<a name="BECollection"></a>
## BECollection
A generic model for BE collections.

**Kind**: global class  

* [BECollection](#BECollection)
  * [new BECollection(data, conf)](#new_BECollection_new)
  * [.push()](#BECollection+push)
  * [.pop()](#BECollection+pop)
  * [.shift()](#BECollection+shift)
  * [.splice()](#BECollection+splice)
  * [.$fetch(url)](#BECollection+$fetch) ⇒ <code>Promise</code>
  * [.$filter(filter)](#BECollection+$filter) ⇒ <code>Array</code>
  * [.$toArray()](#BECollection+$toArray) ⇒ <code>Array</code>

<a name="new_BECollection_new"></a>
### new BECollection(data, conf)
Instantiate a BECollection Array.


| Param | Type | Description |
| --- | --- | --- |
| data | <code>String</code> &#124; <code>Array</code> &#124; <code>Object</code> | If `String` case, it's the endpoint to fetch. If `Array`, it's the initial state of the collection. If `Object`, it's an object with `<array>items` and `<number>count` fields (in case of pagination). |
| conf | <code>Object</code> | An optional set of BEApi configuration params. |

<a name="BECollection+push"></a>
### beCollection.push()
Extend `Array.prototype.push`. Same input/output. Automatically transform plain objects in BEObject instances.
(see [https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/push](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/push))

**Kind**: instance method of <code>[BECollection](#BECollection)</code>  
<a name="BECollection+pop"></a>
### beCollection.pop()
Extend `Array.prototype.pop`. Same input/output.
(see [https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/pop](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/pop))

**Kind**: instance method of <code>[BECollection](#BECollection)</code>  
<a name="BECollection+shift"></a>
### beCollection.shift()
Extend `Array.prototype.shift`. Same input/output.
(see [https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/shift](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/shift))

**Kind**: instance method of <code>[BECollection](#BECollection)</code>  
<a name="BECollection+splice"></a>
### beCollection.splice()
Extend `Array.prototype.splice`. Same input/output.
(see [https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/shift](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/shift))

**Kind**: instance method of <code>[BECollection](#BECollection)</code>  
<a name="BECollection+$fetch"></a>
### beCollection.$fetch(url) ⇒ <code>Promise</code>
Perform a BEApi request to populate the collection.
If the current model has not a valid url, reject the promise.
At the end of the request, automatically set fetched items.

**Kind**: instance method of <code>[BECollection](#BECollection)</code>  

| Param | Type | Description |
| --- | --- | --- |
| url | <code>String</code> | The endpoint to fetch. |

<a name="BECollection+$filter"></a>
### beCollection.$filter(filter) ⇒ <code>Array</code>
Perform a filter on a BECollection.

**Kind**: instance method of <code>[BECollection](#BECollection)</code>  

| Param | Type | Description |
| --- | --- | --- |
| filter | <code>Object</code> | A plain object to match. |

<a name="BECollection+$toArray"></a>
### beCollection.$toArray() ⇒ <code>Array</code>
Convert a BECollection into a plain array.

**Kind**: instance method of <code>[BECollection](#BECollection)</code>  
