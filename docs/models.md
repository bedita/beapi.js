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
  * [._config(conf)](#BEModel+_config) ⇒ <code>Object</code>
  * [._modified(key)](#BEModel+_modified) ⇒ <code>Array</code>

<a name="new_BEModel_new"></a>
### new BEModel(conf)
Instantiate config properties.


| Param | Type | Description |
| --- | --- | --- |
| conf | <code>Object</code> | A configuration set. |

<a name="BEModel+_config"></a>
### beModel._config(conf) ⇒ <code>Object</code>
Get or set configuration params.

**Kind**: instance method of <code>[BEModel](#BEModel)</code>  
**Returns**: <code>Object</code> - The current configuration set.  

| Param | Type | Description |
| --- | --- | --- |
| conf | <code>Object</code> | An optional set of configuration params. |

<a name="BEModel+_modified"></a>
### beModel._modified(key) ⇒ <code>Array</code>
Get a list of fields that need to sync with the server or add e new one.

**Kind**: instance method of <code>[BEModel](#BEModel)</code>  
**Returns**: <code>Array</code> - A list of fields which need to be synced.  

| Param | Type | Description |
| --- | --- | --- |
| key | <code>String</code> &#124; <code>Boolean</code> | An optional field name which needs to be synced. If `false` is passed, the array will be resetted. |

<a name="BEArray"></a>
## BEArray
A base model for BE collections.

**Kind**: global class  

* [BEArray](#BEArray)
  * [new BEArray(items, conf)](#new_BEArray_new)
  * [._config(conf)](#BEArray+_config) ⇒ <code>Object</code>
  * [._modified(key)](#BEArray+_modified) ⇒ <code>Array</code>

<a name="new_BEArray_new"></a>
### new BEArray(items, conf)
Instantiate items and config properties.


| Param | Type | Description |
| --- | --- | --- |
| items | <code>Array</code> | A list of `BEModel` objects. |
| conf | <code>Object</code> | A configuration set. |

<a name="BEArray+_config"></a>
### beArray._config(conf) ⇒ <code>Object</code>
Get or set configuration params.

**Kind**: instance method of <code>[BEArray](#BEArray)</code>  
**Returns**: <code>Object</code> - The current configuration set.  

| Param | Type | Description |
| --- | --- | --- |
| conf | <code>Object</code> | An optional set of configuration params. |

<a name="BEArray+_modified"></a>
### beArray._modified(key) ⇒ <code>Array</code>
Get a list of fields that need to sync with the server or add e new one.

**Kind**: instance method of <code>[BEArray](#BEArray)</code>  
**Returns**: <code>Array</code> - A list of fields which need to be synced.  

| Param | Type | Description |
| --- | --- | --- |
| key | <code>String</code> &#124; <code>Boolean</code> | An optional field name which needs to be synced. If `false` is passed, the array will be resetted. |

