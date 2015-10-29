## Classes
<dl>
<dt><a href="#BEModel">BEModel</a></dt>
<dd><p>A base model for BE objects.</p>
</dd>
<dt><a href="#BEArray">BEArray</a></dt>
<dd><p>A base model for BE collections.</p>
</dd>
</dl>
<a name="BEModel"></a>
## BEModel
A base model for BE objects.

**Kind**: global class  

* [BEModel](#BEModel)
  * [new BEModel(conf)](#new_BEModel_new)
  * _instance_
    * [.$id()](#BEModel+$id) ⇒ <code>String</code> &#124; <code>Number</code>
    * [.$config(conf)](#BEModel+$config) ⇒ <code>Object</code>
    * [.$modified(key)](#BEModel+$modified) ⇒ <code>Array</code>
    * [.$remove()](#BEModel+$remove) ⇒ <code>Boolean</code>
    * [.$toJSON()](#BEModel+$toJSON) ⇒ <code>Object</code>
  * _static_
    * [.generateId()](#BEModel.generateId) ⇒ <code>String</code> &#124; <code>Number</code>
    * [.readRegistry(The)](#BEModel.readRegistry) ⇒ <code>\*</code>
    * [.updateRegistry(The)](#BEModel.updateRegistry) ⇒ <code>\*</code>
    * [.removeFromRegistry(The)](#BEModel.removeFromRegistry)

<a name="new_BEModel_new"></a>
### new BEModel(conf)
Instantiate config properties.


| Param | Type | Description |
| --- | --- | --- |
| conf | <code>Object</code> | A configuration set. |

<a name="BEModel+$id"></a>
### beModel.$id() ⇒ <code>String</code> &#124; <code>Number</code>
Get the client registry ID.

**Kind**: instance method of <code>[BEModel](#BEModel)</code>  
**Returns**: <code>String</code> &#124; <code>Number</code> - The client registry ID.  
<a name="BEModel+$config"></a>
### beModel.$config(conf) ⇒ <code>Object</code>
Get or set configuration params.

**Kind**: instance method of <code>[BEModel](#BEModel)</code>  
**Returns**: <code>Object</code> - The current configuration set.  

| Param | Type | Description |
| --- | --- | --- |
| conf | <code>Object</code> | An optional set of configuration params. |

<a name="BEModel+$modified"></a>
### beModel.$modified(key) ⇒ <code>Array</code>
Get a list of fields that need to sync with the server or add e new one.

**Kind**: instance method of <code>[BEModel](#BEModel)</code>  
**Returns**: <code>Array</code> - A list of fields which need to be synced.  

| Param | Type | Description |
| --- | --- | --- |
| key | <code>String</code> &#124; <code>Boolean</code> | An optional field name which needs to be synced. If `false` is passed, the array will be resetted. |

<a name="BEModel+$remove"></a>
### beModel.$remove() ⇒ <code>Boolean</code>
Destroy a model and remove its references from the registry.

**Kind**: instance method of <code>[BEModel](#BEModel)</code>  
**Returns**: <code>Boolean</code> - The model has actually been removed.  
<a name="BEModel+$toJSON"></a>
### beModel.$toJSON() ⇒ <code>Object</code>
Returns a plain javascript object with the model data.

**Kind**: instance method of <code>[BEModel](#BEModel)</code>  
<a name="BEModel.generateId"></a>
### BEModel.generateId() ⇒ <code>String</code> &#124; <code>Number</code>
Generate an unique id.

**Kind**: static method of <code>[BEModel](#BEModel)</code>  
**Returns**: <code>String</code> &#124; <code>Number</code> - An unique id.  
<a name="BEModel.readRegistry"></a>
### BEModel.readRegistry(The) ⇒ <code>\*</code>
Read a value stored in the registry for a specific model.

**Kind**: static method of <code>[BEModel](#BEModel)</code>  
**Returns**: <code>\*</code> - The stored value.  

| Param | Type | Description |
| --- | --- | --- |
| The | <code>Object</code> &#124; <code>String</code> &#124; <code>Number</code> | model or its registry id. |

<a name="BEModel.updateRegistry"></a>
### BEModel.updateRegistry(The) ⇒ <code>\*</code>
Update a value stored in the registry for a specific model.

**Kind**: static method of <code>[BEModel](#BEModel)</code>  
**Returns**: <code>\*</code> - The stored value.  

| Param | Type | Description |
| --- | --- | --- |
| The | <code>Object</code> &#124; <code>String</code> &#124; <code>Number</code> | model or its registry id. |

<a name="BEModel.removeFromRegistry"></a>
### BEModel.removeFromRegistry(The)
Remove a model entry from the registry.

**Kind**: static method of <code>[BEModel](#BEModel)</code>  

| Param | Type | Description |
| --- | --- | --- |
| The | <code>Object</code> &#124; <code>String</code> &#124; <code>Number</code> | model or its registry id. |

<a name="BEArray"></a>
## BEArray
A base model for BE collections.

**Kind**: global class  

* [BEArray](#BEArray)
  * [new BEArray(items, conf)](#new_BEArray_new)
  * [.$id()](#BEArray+$id) ⇒ <code>String</code> &#124; <code>Number</code>
  * [.$config(conf)](#BEArray+$config) ⇒ <code>Object</code>
  * [.$modified(key)](#BEArray+$modified) ⇒ <code>Array</code>

<a name="new_BEArray_new"></a>
### new BEArray(items, conf)
Instantiate items and config properties.


| Param | Type | Description |
| --- | --- | --- |
| items | <code>Array</code> | A list of `BEModel` objects. |
| conf | <code>Object</code> | A configuration set. |

<a name="BEArray+$id"></a>
### beArray.$id() ⇒ <code>String</code> &#124; <code>Number</code>
Get the client registry ID.

**Kind**: instance method of <code>[BEArray](#BEArray)</code>  
**Returns**: <code>String</code> &#124; <code>Number</code> - The client registry ID.  
<a name="BEArray+$config"></a>
### beArray.$config(conf) ⇒ <code>Object</code>
Get or set configuration params.

**Kind**: instance method of <code>[BEArray](#BEArray)</code>  
**Returns**: <code>Object</code> - The current configuration set.  

| Param | Type | Description |
| --- | --- | --- |
| conf | <code>Object</code> | An optional set of configuration params. |

<a name="BEArray+$modified"></a>
### beArray.$modified(key) ⇒ <code>Array</code>
Get a list of fields that need to sync with the server or add e new one.

**Kind**: instance method of <code>[BEArray](#BEArray)</code>  
**Returns**: <code>Array</code> - A list of fields which need to be synced.  

| Param | Type | Description |
| --- | --- | --- |
| key | <code>String</code> &#124; <code>Boolean</code> | An optional field name which needs to be synced. If `false` is passed, the array will be resetted. |

