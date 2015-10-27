<a name="BEObject"></a>
## BEObject
A generic model for BE objects.

**Kind**: global class  
**See**: [BEModel.constructor](BEModel.constructor).  

* [BEObject](#BEObject)
  * [new BEObject(data, conf)](#new_BEObject_new)
  * [.fetch()](#BEObject+fetch) ⇒ <code>Promise</code>
  * [.save(data)](#BEObject+save) ⇒ <code>Promise</code>
  * [.create(data)](#BEObject+create) ⇒ <code>Promise</code>
  * [.remove()](#BEObject+remove) ⇒ <code>Promise</code>
  * [.clone()](#BEObject+clone) ⇒ <code>[BEObject](#BEObject)</code>
  * [.isNew()](#BEObject+isNew) ⇒ <code>Boolean</code>
  * [.set(data, value)](#BEObject+set) ⇒ <code>[BEObject](#BEObject)</code>
  * [.is(filter)](#BEObject+is) ⇒ <code>Boolean</code>

<a name="new_BEObject_new"></a>
### new BEObject(data, conf)
Set up the model.


| Param | Type | Description |
| --- | --- | --- |
| data | <code>Object</code> | The initial data to set. |
| conf | <code>Object</code> | An optional set of configuration params. |

<a name="BEObject+fetch"></a>
### beObject.fetch() ⇒ <code>Promise</code>
Perform a BEApi request to populate the model.
If the current model has not a valid ID or a valid nickname, reject the promise.
At the end of the request, automatically set fetched data.

**Kind**: instance method of <code>[BEObject](#BEObject)</code>  
<a name="BEObject+save"></a>
### beObject.save(data) ⇒ <code>Promise</code>
Perform a BEApi request to sync the model with the server.
If the current model has not a valid ID or a valid nickname, a new object will be created.
At the end of the request, automatically set new fetched data.

**Kind**: instance method of <code>[BEObject](#BEObject)</code>  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>Object</code> | Optional data to set before save. |

<a name="BEObject+create"></a>
### beObject.create(data) ⇒ <code>Promise</code>
A [BEObject.save](BEObject.save) wrapper for object creation.

**Kind**: instance method of <code>[BEObject](#BEObject)</code>  
**Throws**:

- If the model already has a valid ID.


| Param | Type | Description |
| --- | --- | --- |
| data | <code>Object</code> | Optional data to set before creation. |

<a name="BEObject+remove"></a>
### beObject.remove() ⇒ <code>Promise</code>
Perform a BEApi request to delete the object.

**Kind**: instance method of <code>[BEObject](#BEObject)</code>  
**Throws**:

- If the model has not a valid ID or a valid nickname.

<a name="BEObject+clone"></a>
### beObject.clone() ⇒ <code>[BEObject](#BEObject)</code>
Clone the model.

**Kind**: instance method of <code>[BEObject](#BEObject)</code>  
**Returns**: <code>[BEObject](#BEObject)</code> - The clone model.  
<a name="BEObject+isNew"></a>
### beObject.isNew() ⇒ <code>Boolean</code>
Check if the model is new (client-side created).

**Kind**: instance method of <code>[BEObject](#BEObject)</code>  
<a name="BEObject+set"></a>
### beObject.set(data, value) ⇒ <code>[BEObject](#BEObject)</code>
Set data to the model.
Automatically create BECollection for children and relations.* fields.
Automatically create a BEObject for the parent if `parent_id` is specified.
Automatically convert ISO string dates into {Date} objects.
Add to the `__modified` the key that needs to be sync with the server.

**Kind**: instance method of <code>[BEObject](#BEObject)</code>  
**Returns**: <code>[BEObject](#BEObject)</code> - The instance.  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>Object</code> &#124; <code>String</code> | A set of data to set or a key to update. |
| value | <code>\*</code> | The value to set to the `data` key string. |

<a name="BEObject+is"></a>
### beObject.is(filter) ⇒ <code>Boolean</code>
Check if the model match a filter.

**Kind**: instance method of <code>[BEObject](#BEObject)</code>  

| Param | Type | Description |
| --- | --- | --- |
| filter | <code>Object</code> &#124; <code>String</code> &#124; <code>RegExp</code> | The filter to use. Could be any dataset, a simple string, or a regular expression. |

