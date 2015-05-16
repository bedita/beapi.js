# beapi.js
Manage BEdita API calls on your javascript client using this tiny library in your application.

##Use in the browser

- Via bower:

		bower install beapi.js

- Via download and reference:
	- Download beapi.js
	- Include in your app
			
			<script type="text/javascript" src="path/to/beapi.js"></script>
			
##Use with nodejs

```
npm install beapi.js
```

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

Right now, **beapi.js** stores `access_token`, `refresh_token` and `access_token_expire_date` in the browser `localStorage` or using node `fs`. If your project needs to support browsers without the localStorage interface, or if you want to use other types of store, you can replace `beapi.storage` with another Object with the same interface.


##beapi.js generic methods

###.get(*options*)
###.post(*options*)
###.put(*options*)
###.delete(*options*)

##beapi.js auth methods

###.auth(*username*, *password*)
###.getAccessToken()
###.getRefreshToken()
###.getAccessTokenExpireDate()
###.isTokenExpired()
###.refreshToken()
###.logout()

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
