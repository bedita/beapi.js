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

- Navigate to the project path and run:

		npm run build


### Running tests

- Configure your test environment, using `tests/conf.js.sample` as footprint for you configuration:

		mv tests/conf.js.sample tests/conf.js

- and run:

		npm run tests


### Release

- Navigate to the project path and run:

		npm run release X.X.X
