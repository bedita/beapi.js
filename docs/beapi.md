<a name="BEApi"></a>
## BEApi
Create an interface to communicate with a BEdita API frontend.

**Kind**: global class  

* [BEApi](#BEApi)
  * [new BEApi(conf)](#new_BEApi_new)
  * _instance_
    * [.defaultConfigKey](#BEApi+defaultConfigKey) : <code>String</code>
    * [.configKey](#BEApi+configKey) : <code>String</code>
    * [.getConfiguration()](#BEApi+getConfiguration) : <code>object</code>
    * [.setBaseUrl(url)](#BEApi+setBaseUrl) ⇒ <code>Object</code>
    * [.get(conf)](#BEApi+get) ⇒ <code>Promise</code>
    * [.post(conf)](#BEApi+post) ⇒ <code>Promise</code>
    * [.put(conf)](#BEApi+put) ⇒ <code>Promise</code>
    * [.delete(conf)](#BEApi+delete) ⇒ <code>Promise</code>
    * [.auth(username, password)](#BEApi+auth) ⇒ <code>Promise</code>
    * [.refreshToken()](#BEApi+refreshToken) ⇒ <code>Promise</code>
    * [.logout()](#BEApi+logout) ⇒ <code>Promise</code>
    * [.getAccessToken()](#BEApi+getAccessToken) ⇒ <code>String</code>
    * [.getRefreshToken()](#BEApi+getRefreshToken) ⇒ <code>String</code>
    * [.getAccessTokenExpireDate()](#BEApi+getAccessTokenExpireDate) ⇒ <code>Date</code>
    * [.isTokenExpired()](#BEApi+isTokenExpired) ⇒ <code>Boolean</code>
  * _static_
    * [.storage](#BEApi.storage) ⇒ <code>Object</code>
    * [.xhr](#BEApi.xhr) ⇒ <code>Object</code>

<a name="new_BEApi_new"></a>
### new BEApi(conf)
Instantiate a BEApi Object.


| Param | Type | Description |
| --- | --- | --- |
| conf | <code>Object</code> | A set of options. |

<a name="BEApi+defaultConfigKey"></a>
### beApi.defaultConfigKey : <code>String</code>
The default register configuration key.

**Kind**: instance property of <code>[BEApi](#BEApi)</code>  
<a name="BEApi+configKey"></a>
### beApi.configKey : <code>String</code>
Return the chosen registry configuration key or the default one.

**Kind**: instance property of <code>[BEApi](#BEApi)</code>  
**Default**: <code>&#x27;default&#x27;</code>  
<a name="BEApi+getConfiguration"></a>
### beApi.getConfiguration() : <code>object</code>
Get instance configuration object.

**Kind**: instance method of <code>[BEApi](#BEApi)</code>  
<a name="BEApi+setBaseUrl"></a>
### beApi.setBaseUrl(url) ⇒ <code>Object</code>
Convenience method to set the BEdita API frontend base url.

**Kind**: instance method of <code>[BEApi](#BEApi)</code>  
**Returns**: <code>Object</code> - The BEApi instance.  

| Param | Type | Description |
| --- | --- | --- |
| url | <code>String</code> | The url to set. |

<a name="BEApi+get"></a>
### beApi.get(conf) ⇒ <code>Promise</code>
Perform an API GET request.
- Automatically set `GET` as request method.
- Use [_processOptions](_processOptions) and [_processOptions](_processOptions)

**Kind**: instance method of <code>[BEApi](#BEApi)</code>  
**Returns**: <code>Promise</code> - The Ajax request Promise.  

| Param | Type | Description |
| --- | --- | --- |
| conf | <code>Object</code> | A set of options to pass to the Ajax request. |

<a name="BEApi+post"></a>
### beApi.post(conf) ⇒ <code>Promise</code>
Perform an API POST request.
- Automatically set `POST` as request method.
- Use [_processOptions](_processOptions) and [_processOptions](_processOptions)

**Kind**: instance method of <code>[BEApi](#BEApi)</code>  
**Returns**: <code>Promise</code> - The Ajax request Promise.  

| Param | Type | Description |
| --- | --- | --- |
| conf | <code>Object</code> | A set of options to pass to the Ajax request. |

<a name="BEApi+put"></a>
### beApi.put(conf) ⇒ <code>Promise</code>
Perform an API PUT request.
- Automatically set `PUT` as request method.
- Use [_processOptions](_processOptions) and [_processOptions](_processOptions)

**Kind**: instance method of <code>[BEApi](#BEApi)</code>  
**Returns**: <code>Promise</code> - The Ajax request Promise.  

| Param | Type | Description |
| --- | --- | --- |
| conf | <code>Object</code> | A set of options to pass to the Ajax request. |

<a name="BEApi+delete"></a>
### beApi.delete(conf) ⇒ <code>Promise</code>
Perform an API DELETE request.
- Automatically set `DELETE` as request method.
- Use [_processOptions](_processOptions) and [_processOptions](_processOptions)

**Kind**: instance method of <code>[BEApi](#BEApi)</code>  
**Returns**: <code>Promise</code> - The Ajax request Promise.  

| Param | Type | Description |
| --- | --- | --- |
| conf | <code>Object</code> | A set of options to pass to the Ajax request. |

<a name="BEApi+auth"></a>
### beApi.auth(username, password) ⇒ <code>Promise</code>
Perform an API Auth request.
- Use [_processAuth](_processAuth)
- Automatically store Access Token to the storage (@see [BEApi#storage](BEApi#storage)).

**Kind**: instance method of <code>[BEApi](#BEApi)</code>  
**Returns**: <code>Promise</code> - The Ajax request Promise.  

| Param | Type | Description |
| --- | --- | --- |
| username | <code>String</code> | The username. |
| password | <code>String</code> | The user's password. |

<a name="BEApi+refreshToken"></a>
### beApi.refreshToken() ⇒ <code>Promise</code>
Perform an API Refresh Token request.
- Use [_processAuth](_processAuth)
- Retrieve Access Token from the storage (@see [BEApi#storage](BEApi#storage)).

**Kind**: instance method of <code>[BEApi](#BEApi)</code>  
**Returns**: <code>Promise</code> - The Ajax request Promise.  
<a name="BEApi+logout"></a>
### beApi.logout() ⇒ <code>Promise</code>
Perform an API Logout request.
- Remove all BEApi data from the storage (@see [BEApi#storage](BEApi#storage)).

**Kind**: instance method of <code>[BEApi](#BEApi)</code>  
**Returns**: <code>Promise</code> - The Ajax request Promise.  
<a name="BEApi+getAccessToken"></a>
### beApi.getAccessToken() ⇒ <code>String</code>
Retrieve Access Token from the storage (@see [BEApi#storage](BEApi#storage)).

**Kind**: instance method of <code>[BEApi](#BEApi)</code>  
**Returns**: <code>String</code> - The Access Token  
<a name="BEApi+getRefreshToken"></a>
### beApi.getRefreshToken() ⇒ <code>String</code>
Retrieve Refresh Token from the storage (@see [BEApi#storage](BEApi#storage)).

**Kind**: instance method of <code>[BEApi](#BEApi)</code>  
**Returns**: <code>String</code> - The Refresh Token  
<a name="BEApi+getAccessTokenExpireDate"></a>
### beApi.getAccessTokenExpireDate() ⇒ <code>Date</code>
Retrieve Access Token Expire Date from the storage (@see [BEApi#storage](BEApi#storage)).

**Kind**: instance method of <code>[BEApi](#BEApi)</code>  
**Returns**: <code>Date</code> - The Access Token Expire Date  
<a name="BEApi+isTokenExpired"></a>
### beApi.isTokenExpired() ⇒ <code>Boolean</code>
Check if Access Token is expired

**Kind**: instance method of <code>[BEApi](#BEApi)</code>  
**Returns**: <code>Boolean</code> - If token is expired, return `true`, otherwise `false`  
<a name="BEApi.storage"></a>
### BEApi.storage ⇒ <code>Object</code>
Retrieve the storage interface.
The storage is used to save access and refresh tokens.
By default, the storage interface in the browser is the localStorage [https://developer.mozilla.org/it/docs/Web/API/Window/localStorage](https://developer.mozilla.org/it/docs/Web/API/Window/localStorage)
while in a Node environment is `node-localstorage` [https://www.npmjs.com/package/node-localstorage](https://www.npmjs.com/package/node-localstorage)

**Kind**: static property of <code>[BEApi](#BEApi)</code>  
**Returns**: <code>Object</code> - The storage interface  
<a name="BEApi.xhr"></a>
### BEApi.xhr ⇒ <code>Object</code>
Retrieve the Ajax interface.
The Ajax is used to perform XMLHttpRequest requests.
By default, the Ajax interface in the browser is the XMLHttpRequest [https://developer.mozilla.org/it/docs/Web/API/XMLHttpRequest](https://developer.mozilla.org/it/docs/Web/API/XMLHttpRequest)
while in a Node environment is `xmlhttprequest` [https://www.npmjs.com/package/xmlhttprequest](https://www.npmjs.com/package/xmlhttprequest)

**Kind**: static property of <code>[BEApi](#BEApi)</code>  
**Returns**: <code>Object</code> - The Ajax interface  
