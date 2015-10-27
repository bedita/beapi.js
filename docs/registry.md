<a name="BEApiRegistry"></a>
## BEApiRegistry
A registry of BEApi configuration.
Everywhere, in your JavaScript application, you can use `BEApiRegistry.getInstance(key)` to retrieve a BEApi configration.
Register BEApi configurations is lighter and simpler than register instances.
Use BEApiRegistry to share configuration between models, interfaces and queues.

**Kind**: global class  

* [BEApiRegistry](#BEApiRegistry)
  * [.add(key, conf)](#BEApiRegistry.add)
  * [.getInstance(key)](#BEApiRegistry.getInstance) ⇒ <code>Object</code>
  * [.remove(key)](#BEApiRegistry.remove) ⇒ <code>Boolean</code>

<a name="BEApiRegistry.add"></a>
### BEApiRegistry.add(key, conf)
Add a configuration using the provided key.

**Kind**: static method of <code>[BEApiRegistry](#BEApiRegistry)</code>  

| Param | Type | Description |
| --- | --- | --- |
| key | <code>String</code> | The key to use to register the configuration. |
| conf | <code>Object</code> | The configuration. |

<a name="BEApiRegistry.getInstance"></a>
### BEApiRegistry.getInstance(key) ⇒ <code>Object</code>
Retrieve a configuration using the provided key.

**Kind**: static method of <code>[BEApiRegistry](#BEApiRegistry)</code>  
**Returns**: <code>Object</code> - The configuration.  

| Param | Type | Description |
| --- | --- | --- |
| key | <code>String</code> | The key to use to read the configuration. |

<a name="BEApiRegistry.remove"></a>
### BEApiRegistry.remove(key) ⇒ <code>Boolean</code>
Remove a configuration using the provided key.

**Kind**: static method of <code>[BEApiRegistry](#BEApiRegistry)</code>  
**Returns**: <code>Boolean</code> - If the configuration exists, return `true` after remotion, otherwise return `false`.  

| Param | Type | Description |
| --- | --- | --- |
| key | <code>String</code> | The key to use to remove the configuration. |

