## Classes
<dl>
<dt><a href="#BEApiQueue">BEApiQueue</a></dt>
<dd><p>Create a chainable queue of BEApi requests.</p>
</dd>
<dt><a href="#BEApiQueueTask">BEApiQueueTask</a></dt>
<dd><p>Create a task model to insert into a BEApiQueue.</p>
</dd>
<dt><a href="#BEApiQueueBaseMethod">BEApiQueueBaseMethod</a></dt>
<dd><p>Abstract class for <code>BEApiQueue Method</code>s.</p>
</dd>
</dl>
<a name="BEApiQueue"></a>
## BEApiQueue
Create a chainable queue of BEApi requests.

**Kind**: global class  

* [BEApiQueue](#BEApiQueue)
  * [new BEApiQueue(conf)](#new_BEApiQueue_new)
  * _instance_
    * [.reset()](#BEApiQueue+reset) ⇒ <code>[BEApiQueue](#BEApiQueue)</code>
    * [.add(task)](#BEApiQueue+add) ⇒ <code>[BEApiQueue](#BEApiQueue)</code>
    * [.exec()](#BEApiQueue+exec) ⇒ <code>Promise</code>
    * [.get()](#BEApiQueue+get)
    * [.first()](#BEApiQueue+first) ⇒ <code>[BEApiQueueTask](#BEApiQueueTask)</code>
    * [.last()](#BEApiQueue+last) ⇒ <code>[BEApiQueueTask](#BEApiQueueTask)</code>
    * [.then(done, fail)](#BEApiQueue+then) ⇒ <code>Promise</code>
    * [.all(done, fail)](#BEApiQueue+all) ⇒ <code>Promise</code>
  * _static_
    * [.register(taskName, def)](#BEApiQueue.register)

<a name="new_BEApiQueue_new"></a>
### new BEApiQueue(conf)
Instantiate a BEApiQueue Object.


| Param | Type | Description |
| --- | --- | --- |
| conf | <code>String</code> &#124; <code>Object</code> &#124; <code>BEApi</code> | A set of options or a configuration key for BEApiRegistry. |

<a name="BEApiQueue+reset"></a>
### beApiQueue.reset() ⇒ <code>[BEApiQueue](#BEApiQueue)</code>
Reset the queue.

**Kind**: instance method of <code>[BEApiQueue](#BEApiQueue)</code>  
**Returns**: <code>[BEApiQueue](#BEApiQueue)</code> - the instance  
<a name="BEApiQueue+add"></a>
### beApiQueue.add(task) ⇒ <code>[BEApiQueue](#BEApiQueue)</code>
Add a BEApiQueueTask instance to the queue.

**Kind**: instance method of <code>[BEApiQueue](#BEApiQueue)</code>  
**Returns**: <code>[BEApiQueue](#BEApiQueue)</code> - the instance  

| Param | Type |
| --- | --- |
| task | <code>[BEApiQueueTask](#BEApiQueueTask)</code> | 

<a name="BEApiQueue+exec"></a>
### beApiQueue.exec() ⇒ <code>Promise</code>
Perform the queue of requests.

**Kind**: instance method of <code>[BEApiQueue](#BEApiQueue)</code>  
**Returns**: <code>Promise</code> - the global promise  
<a name="BEApiQueue+get"></a>
### beApiQueue.get()
Alias of `BEApiQueue.exec`.
see [exec](#BEApiQueue+exec)

**Kind**: instance method of <code>[BEApiQueue](#BEApiQueue)</code>  
<a name="BEApiQueue+first"></a>
### beApiQueue.first() ⇒ <code>[BEApiQueueTask](#BEApiQueueTask)</code>
Get the first task in queue.

**Kind**: instance method of <code>[BEApiQueue](#BEApiQueue)</code>  
**Returns**: <code>[BEApiQueueTask](#BEApiQueueTask)</code> - The first task.  
<a name="BEApiQueue+last"></a>
### beApiQueue.last() ⇒ <code>[BEApiQueueTask](#BEApiQueueTask)</code>
Get the last task in queue.

**Kind**: instance method of <code>[BEApiQueue](#BEApiQueue)</code>  
**Returns**: <code>[BEApiQueueTask](#BEApiQueueTask)</code> - The last task.  
<a name="BEApiQueue+then"></a>
### beApiQueue.then(done, fail) ⇒ <code>Promise</code>
Alias of the last task in queue `promise.then`.
Attach a success and/or fail callback to the last added task.
If the queue is empty, the method `BEApiQueue.all` [all](#BEApiQueue+all) is called instead.

**Kind**: instance method of <code>[BEApiQueue](#BEApiQueue)</code>  
**Returns**: <code>Promise</code> - The last task promise or the global promise.  

| Param | Type | Description |
| --- | --- | --- |
| done | <code>function</code> | The success callback [optional]. |
| fail | <code>function</code> | The fail callback [optional]. |

<a name="BEApiQueue+all"></a>
### beApiQueue.all(done, fail) ⇒ <code>Promise</code>
Alias of the global `promise.then`.
Attach a success and/or fail callback to the global queue promise.

**Kind**: instance method of <code>[BEApiQueue](#BEApiQueue)</code>  
**Returns**: <code>Promise</code> - The global promise.  

| Param | Type | Description |
| --- | --- | --- |
| done | <code>function</code> | The success callback [optional]. |
| fail | <code>function</code> | The fail callback [optional]. |

<a name="BEApiQueue.register"></a>
### BEApiQueue.register(taskName, def)
Attach a method to the `BEApiQueue.prototype`.
The attached method should be an instance of `BEApiQueueBaseMethod`.

**Kind**: static method of <code>[BEApiQueue](#BEApiQueue)</code>  

| Param | Type | Description |
| --- | --- | --- |
| taskName | <code>String</code> | The name of the function attached to the prototype. |
| def | <code>[BEApiQueueBaseMethod](#BEApiQueueBaseMethod)</code> | The method class. |

<a name="BEApiQueueTask"></a>
## BEApiQueueTask
Create a task model to insert into a BEApiQueue.

**Kind**: global class  
<a name="new_BEApiQueueTask_new"></a>
### new BEApiQueueTask(method, args)
Instantiate a BEApiQueueTask Object.


| Param | Type | Description |
| --- | --- | --- |
| method | <code>function</code> | A BEApiQueue Method class constructor. |
| args | <code>Array</code> | The list of arguments to pass to the BEApiQueue Method constructor |

<a name="BEApiQueueBaseMethod"></a>
## BEApiQueueBaseMethod
Abstract class for `BEApiQueue Method`s.

**Kind**: global class  

* [BEApiQueueBaseMethod](#BEApiQueueBaseMethod)
  * [new BEApiQueueBaseMethod()](#new_BEApiQueueBaseMethod_new)
  * [.type](#BEApiQueueBaseMethod+type) : <code>String</code>
  * [.input(scope, args)](#BEApiQueueBaseMethod+input) ⇒ <code>Promise</code>
  * [.validate(res)](#BEApiQueueBaseMethod+validate) ⇒ <code>Promise</code>
  * [.transform(scope, res)](#BEApiQueueBaseMethod+transform) ⇒ <code>Promise</code>

<a name="new_BEApiQueueBaseMethod_new"></a>
### new BEApiQueueBaseMethod()
Initialize a `BEApiQueue Method`.

<a name="BEApiQueueBaseMethod+type"></a>
### beApiQueueBaseMethod.type : <code>String</code>
The HTTP method of the request.

**Kind**: instance property of <code>[BEApiQueueBaseMethod](#BEApiQueueBaseMethod)</code>  
**Default**: <code>&#x27;get&#x27;</code>  
<a name="BEApiQueueBaseMethod+input"></a>
### beApiQueueBaseMethod.input(scope, args) ⇒ <code>Promise</code>
Arguments input processor.

**Kind**: instance method of <code>[BEApiQueueBaseMethod](#BEApiQueueBaseMethod)</code>  
**Returns**: <code>Promise</code> - A promise resolved when all inputs are processed.  

| Param | Type | Description |
| --- | --- | --- |
| scope | <code>Object</code> | The scope for the queue. |
| args | <code>\*</code> | All the arguments passed to the method when invoked in queue. |

<a name="BEApiQueueBaseMethod+validate"></a>
### beApiQueueBaseMethod.validate(res) ⇒ <code>Promise</code>
Validate the result of a request response.

**Kind**: instance method of <code>[BEApiQueueBaseMethod](#BEApiQueueBaseMethod)</code>  
**Returns**: <code>Promise</code> - A promise resolved when the response is validated.  

| Param | Type | Description |
| --- | --- | --- |
| res | <code>Object</code> | The request response. |

<a name="BEApiQueueBaseMethod+transform"></a>
### beApiQueueBaseMethod.transform(scope, res) ⇒ <code>Promise</code>
Transform the result of a request response.

**Kind**: instance method of <code>[BEApiQueueBaseMethod](#BEApiQueueBaseMethod)</code>  
**Returns**: <code>Promise</code> - A promise resolved when scope changes are finished.  

| Param | Type | Description |
| --- | --- | --- |
| scope | <code>Object</code> | The scope for the queue. |
| res | <code>Object</code> | The request response. |

