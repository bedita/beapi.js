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
    * [.$toJSON()](#BEModel+$toJSON) ⇒ <code>Object</code>
    * [.$on(name, callback)](#BEModel+$on) ⇒ <code>function</code>
    * [.$off(name)](#BEModel+$off)
    * [.$trigger(obj, name, ...args)](#BEModel+$trigger)
  * _static_
    * [.uid()](#BEModel.uid) ⇒ <code>String</code> &#124; <code>Number</code>

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
<a name="BEModel+$toJSON"></a>
### beModel.$toJSON() ⇒ <code>Object</code>
Returns a plain javascript object with the model data.

**Kind**: instance method of <code>[BEModel](#BEModel)</code>  
<a name="BEModel+$on"></a>
### beModel.$on(name, callback) ⇒ <code>function</code>
Add a callbacks for the specified trigger.

**Kind**: instance method of <code>[BEModel](#BEModel)</code>  
**Returns**: <code>function</code> - Destroy created listener with this function  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>String</code> | The event name |
| callback | <code>function</code> | The callback function |

<a name="BEModel+$off"></a>
### beModel.$off(name)
Remove all listeners.

**Kind**: instance method of <code>[BEModel](#BEModel)</code>  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>String</code> | Optional event name to reset |

<a name="BEModel+$trigger"></a>
### beModel.$trigger(obj, name, ...args)
Trigger a callback.

**Kind**: instance method of <code>[BEModel](#BEModel)</code>  
**Exec**: callback functions  

| Param | Type | Description |
| --- | --- | --- |
| obj | <code>\*</code> | The object that triggers events |
| name | <code>String</code> | Event name |
| ...args | <code>Array</code> | Arguments to pass to callback functions |

<a name="BEModel.uid"></a>
### BEModel.uid() ⇒ <code>String</code> &#124; <code>Number</code>
Generate an unique id.

**Kind**: static method of <code>[BEModel](#BEModel)</code>  
**Returns**: <code>String</code> &#124; <code>Number</code> - An unique id.  
<a name="BEArray"></a>
## BEArray
A base model for BE collections.

**Kind**: global class  

* [BEArray](#BEArray)
  * [new BEArray(items, conf)](#new_BEArray_new)
  * [.$on(name, callback)](#BEArray+$on) ⇒ <code>function</code>
  * [.$off(name)](#BEArray+$off)
  * [.$trigger(obj, name, ...args)](#BEArray+$trigger)
  * [.$id()](#BEArray+$id) ⇒ <code>String</code> &#124; <code>Number</code>

<a name="new_BEArray_new"></a>
### new BEArray(items, conf)
Instantiate items and config properties.


| Param | Type | Description |
| --- | --- | --- |
| items | <code>Array</code> | A list of `BEModel` objects. |
| conf | <code>Object</code> | A configuration set. |

<a name="BEArray+$on"></a>
### beArray.$on(name, callback) ⇒ <code>function</code>
Add a callbacks for the specified trigger.

**Kind**: instance method of <code>[BEArray](#BEArray)</code>  
**Returns**: <code>function</code> - Destroy created listener with this function  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>String</code> | The event name |
| callback | <code>function</code> | The callback function |

<a name="BEArray+$off"></a>
### beArray.$off(name)
Remove all listeners.

**Kind**: instance method of <code>[BEArray](#BEArray)</code>  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>String</code> | Optional event name to reset |

<a name="BEArray+$trigger"></a>
### beArray.$trigger(obj, name, ...args)
Trigger a callback.

**Kind**: instance method of <code>[BEArray](#BEArray)</code>  
**Exec**: callback functions  

| Param | Type | Description |
| --- | --- | --- |
| obj | <code>\*</code> | The object that triggers events |
| name | <code>String</code> | Event name |
| ...args | <code>Array</code> | Arguments to pass to callback functions |

<a name="BEArray+$id"></a>
### beArray.$id() ⇒ <code>String</code> &#124; <code>Number</code>
Get the client registry ID.

**Kind**: instance method of <code>[BEArray](#BEArray)</code>  
**Returns**: <code>String</code> &#124; <code>Number</code> - The client registry ID.  
