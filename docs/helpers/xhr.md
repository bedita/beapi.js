<a name="BEXhr"></a>
## BEXhr
XMLHttpRequest wrapper for the browser.

**Kind**: global class  

* [BEXhr](#BEXhr)
  * [.xhr](#BEXhr.xhr) ⇒ <code>Object</code>
  * [.exec(options)](#BEXhr.exec) ⇒ <code>Promise</code>

<a name="BEXhr.xhr"></a>
### BEXhr.xhr ⇒ <code>Object</code>
Retrieve the Ajax interface.
The Ajax is used to perform XMLHttpRequest requests.
By default, the Ajax interface in the browser is the XMLHttpRequest [https://developer.mozilla.org/it/docs/Web/API/XMLHttpRequest](https://developer.mozilla.org/it/docs/Web/API/XMLHttpRequest).
while in a Node environment is `xmlhttprequest` [https://www.npmjs.com/package/xmlhttprequest](https://www.npmjs.com/package/xmlhttprequest).

**Kind**: static property of <code>[BEXhr](#BEXhr)</code>  
**Returns**: <code>Object</code> - The Ajax interface.  
<a name="BEXhr.exec"></a>
### BEXhr.exec(options) ⇒ <code>Promise</code>
Perform an Ajax request.
Set an alternative Ajax interface compatible with a `XMLHttpRequest` like pattern [https://developer.mozilla.org/it/docs/Web/API/XMLHttpRequest](https://developer.mozilla.org/it/docs/Web/API/XMLHttpRequest).

**Kind**: static method of <code>[BEXhr](#BEXhr)</code>  

| Param | Type | Description |
| --- | --- | --- |
| options | <code>Object</code> | A set of options for the Ajax request. |

