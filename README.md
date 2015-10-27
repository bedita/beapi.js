# beapi.js
Manage BEdita API calls on your javascript client using this tiny library in your application.

## Use in the browser

- Via npm:

		npm install beapi.js

- Via bower:

		bower install beapi.js

- Via download and reference:
	- Download [beapi.js](https://github.com/bedita/beapi.js/archive/master.zip)
	- Include in your app

			<script type="text/javascript" src="path/to/beapi.js"></script>


### Promise Polyfill

beapi.js uses the new standard [Promise](https://developer.mozilla.org/it/docs/Web/JavaScript/Reference/Global_Objects/Promise) object ([can i use?](http://caniuse.com/#feat=promises)) provided by EcmaScript 6. If you use bower or npm, the polyfill is a dependency of the project, otherwise you can download it [here](https://github.com/jakearchibald/es6-promise).

## Compatibility

**beapi.js** is based on the standard `XMLHttpRequest`, so it is not compatible (yet) with IE8 and IE9.

BTW, if you are using jQuery or any other library with a built-in ajax system, you can replace the `BEApi.xhr` function with the one you prefer:

```javascript
BEApi.xhr = $.ajax;
```
or, if you are using Angular:

```javascript
.service('$beapi', ['$http', function($http) {
	BEApi.xhr = $http;
	return new BEApi();
}])
```

Right now, **beapi.js** stores `access_token`, `refresh_token` and `access_token_expire_date` in the browser `localStorage` or using node `fs`. If your project needs to support browsers without the `localStorage` interface, or if you want to use other stores, you can replace `beapi.storage` with another `Object` with the same interface.


## BEApi.js generic methods

### .get(*url*|*options*)

Generic GET call.

Accepts:

- `String` *url*: the api endpoint
- **or** `Object` *options*: an options builder compatible object

Returns a `Promise`.

### .post(*url*|*options*, [opt] *data*)

Generic POST call.

Accepts:

- `String` *url*: the api endpoint
- **or** `Object` *options*: an options builder compatible object
- [optional] `Object` *data*: the data body of the POST call. If *options.data* is already defined, *data* will be merge on it.

Returns a `Promise`.

### .put(*url*|*options*, [opt] *data*)

Generic PUT call.

Accepts:

- `String` *url*: the api endpoint
- **or** `Object` *options*: an options builder compatible object
- [optional] `Object` *data*: the data body of the PUT call. If *options.data* is already defined, *data* will be merge on it.

Returns a `Promise`.

### .delete(*url*|*options*)

Generic DELETE call.

Accepts:

- `String` *url*: the api endpoint
- **or** `Object` *options*: an options builder compatible object

Returns a `Promise`.

## BEApi.js auth methods

### .auth(*username*, *password*)

Ask for `accessToken` and `refreshToken` to the server through a POST call and save them in the `localStorage`.

If the authentication is successful, every time that a call to the server will be made, the `accessToken` will be passed in the `Authorization` header.

Accepts:

- `String` *username*: the user nickname
- `String` *password*: the user password

Returns a `Promise`.

### .getAccessToken()

Read the `accessToken` from `localStorage`.

Returns a `String` **or** `undefined` if the user is not authenticated.

### .getRefreshToken()

Read the `refreshToken` from `localStorage`.

Returns a `String` **or** `undefined` if the user is not authenticated.

### .getAccessTokenExpireDate()

Read the expiration date of the `accessToken` from `localStorage`.

Returns a `Date` **or** `undefined` if the user is not authenticated.

### .isTokenExpired()

Check if `accessToken` has expired.

Returns a `Boolean`.

### .refreshToken()

Ask for a new `accessToken` and a new `refreshToken` to the server through a POST call and save them in the `localStorage`.

It automatically passes the old `refreshToken` in the POST call.

Returns a `Promise`.

### .logout()

Ask to the server to invalidate the `refreshToken` through a POST call and remove `accessToken` and `refreshToken` from the `localStorage`.

It automatically passes the `refreshToken` in the POST call.

Returns a `Promise`.

## BEObject and BECollection

### BEObject

The `BEObject` model is useful for fetch and manage object entities.

*Constructor:*

```js
new BEObject(objectData, serverData);
// example
var obj = new BEObject({ id: 1 }, { baseUrl: 'https://bedita.com/api/latest' });
```

*Properties:*

- **`parent`**: a `BEObject` instance representing the parent object (if `parent_id` field is defined).
- **`query`**: a `BEApiQueue` instance representing the current object.

*Methods:*

- **fetch()**: fetch the object data from the server (the object field `id` should be defined)
- **set(*data*)**: update object data
- **is(*data*)**: check if an object matches the object data definition.

### BECollection

An Object representing a Collection of BEdita objects.

*Constructor:*

```js
new BECollection(objectData, serverData);
// example
var listening = new BECollection({ items: [] }, { baseUrl: 'https://bedita.com/api/latest' });
```

*Properties:*

- **items**: an Array of `BEObject`s.
- **length**: the length of Collection (could be defferent from `items.length`, if you have not fetched data yet).

*Methods:*

- **fetch()**: fetch the objects data from the server (the collection `url` should be defined).
- **forEach(*callback*)**: iterate Collection items.
- **filter(*filter*)**: get an Array of filtered objects.

## Build, test and release

### Prerequisites:

- Install [nodejs](https://nodejs.org/)
- Install [babel](https://babeljs.io)
- Install [grunt](http://gruntjs.com/)

		npm install babel grunt  -g

- Install project dependencies

		cd path/to/project
		npm install


### Build

Navigate to the project path and run:

		npm run build


### Release

Navigate to the project path and run:

		npm run release X.X.X


### Running tests

Configure your test environment, using `tests/conf.js.sample` as footprint for you configuration:

		mv tests/conf.js.sample tests/conf.js

Then run:

		npm run tests
