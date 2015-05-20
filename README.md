# beapi.js
Manage BEdita API calls on your javascript client using this tiny library in your application.

##Use in the browser

- Via bower:

		bower install beapi.js

- Via download and reference:
	- Download [beapi.js](https://github.com/bedita/beapi.js/archive/master.zip)
	- Include in your app
			
			<script type="text/javascript" src="path/to/beapi.js"></script>

- Via npm:

		npm install beapi.js
			

##Compatibility

**beapi.js** is based on the standard `XMLHttpRequest`, so it is not compatible (yet) with IE8 and IE9.

BTW, if you are using jQuery or any other library with a built-in ajax system, you can replace the `beapi.xhr` function with the one you prefer:

```javascript
beapi.xhr = $.ajax;
```
or, if you are using Angular:

```javascript
.service('$beapi', ['$http', function($http) {
	beapi.xhr = $http;
	return new beapi();
}])
```

Right now, **beapi.js** stores `access_token`, `refresh_token` and `access_token_expire_date` in the browser `localStorage` or using node `fs`. If your project needs to support browsers without the `localStorage` interface, or if you want to use other stores, you can replace `beapi.storage` with another `Object` with the same interface.


##beapi.js generic methods

###.get(*url*|*options*)

Generic GET call.

Accepts:

- `String` *url*: the api endpoint 
- **or** `Object` *options*: an options builder compatible object

Returns a `Promise`.

###.post(*url*|*options*, [opt] *data*)

Generic POST call.

Accepts:

- `String` *url*: the api endpoint 
- **or** `Object` *options*: an options builder compatible object
- [optional] `Object` *data*: the data body of the POST call. If *options.data* is already defined, *data* will be merge on it.

Returns a `Promise`.

###.put(*url*|*options*, [opt] *data*)

Generic PUT call.

Accepts:

- `String` *url*: the api endpoint 
- **or** `Object` *options*: an options builder compatible object
- [optional] `Object` *data*: the data body of the PUT call. If *options.data* is already defined, *data* will be merge on it.

Returns a `Promise`.

###.delete(*url*|*options*)

Generic DELETE call.

Accepts:

- `String` *url*: the api endpoint 
- **or** `Object` *options*: an options builder compatible object

Returns a `Promise`.

##beapi.js auth methods

###.auth(*username*, *password*)

Ask for `accessToken` and `refreshToken` to the server through a POST call and save them in the `localStorage`.

If the authentication is successful, every time that a call to the server will be made, the `accessToken` will be passed in the `Authorization` header.

Accepts:

- `String` *username*: the user nickname
- `String` *password*: the user password

Returns a `Promise`.

###.getAccessToken()

Read the `accessToken` from `localStorage`.

Returns a `String` **or** `undefined` if the user is not authenticated.

###.getRefreshToken()

Read the `refreshToken` from `localStorage`.

Returns a `String` **or** `undefined` if the user is not authenticated.

###.getAccessTokenExpireDate()

Read the expiration date of the `accessToken` from `localStorage`.

Returns a `Date` **or** `undefined` if the user is not authenticated.

###.isTokenExpired()

Check if `accessToken` has expired.

Returns a `Boolean`.

###.refreshToken()

Ask for a new `accessToken` and a new `refreshToken` to the server through a POST call and save them in the `localStorage`.

It automatically passes the old `refreshToken` in the POST call.

Returns a `Promise`.

###.logout()

Ask to the server to invalidate the `refreshToken` through a POST call and remove `accessToken` and `refreshToken` from the `localStorage`. 

It automatically passes the `refreshToken` in the POST call.

Returns a `Promise`.

##Test

###Prerequisites:
- Install [nodejs](https://nodejs.org/)
- Install mocha

		npm install mocha -g
		
###Install dependencies

Navigate to the project path and run:

```
npm install
```
		
###Configuration

Use `test.json.sample` as footprint for you configuration:

```
mv test.json.sample test.json
```

###Run the tests

```
npm test
```
