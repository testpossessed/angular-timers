# angular-timers
An angular services that acts as a factory for creating testable objects that defer or repeat execution of functions.  Syntax and usage is very close to the standard JavaScript setTimeout and setInterval functions, which it wraps.  As objects they can be mocked and fully controlled for testing.

## Installation
You can of course download the source code and use the files from the dist folder, but the best way to install the package is with bower using

```
    bower install angular-timers --save
```

## Usage
Obviously you will need to include the script in your web page somewhere after angular has been loaded

```html
	<script src='https://ajax.googleapis.com/ajax/libs/angularjs/1.3.15/angular.min.js'></script>
	<script src='/bower_components/angular-timers/angular-timers.min.js'></script>
	<script src='/js/app.js'></script>
```

Next you will need to import the module into your angular application or module

```javascript
// app.js
angular.module('app', ['angular-timers']);
```

And then inject the service into a controller, directive or service

```javascript
// module.js

angular.module('app')
	.controller('MyController', ['timerService', function(timerService){
	// following examples go here
}]
```

### DelayTimer
To execute a function once after a half a second

```javascript
	var timer = timerService.createDelayTimer(500) // delay is specified in milliseconds;
	timer.start(function (){
		console.log('Here I am');
	});
```

To cancel the above timer before the delay expires

```javascript
	var cancelled = timer.cancel(); //tells you if it actually stopped the function in time
```

To query the above timer delay

```javascript
	var delay = timer.getDelay(); // returns 500
```

### RepeatingTimer
To execute a function repeatedly every half second

```javascript
	var timer = timerService.createRepeatingTimer(500) // interval is specified in milliseconds;
	timer.start(function (){
		console.log('Here I am');
	});
```

To stop the above timer from executing the function again

```javascript
	timer.stop();
```

To query the above timer interval

```javascript
	var interval = timer.getInterval(); // returns 500
```

That's it for now.  I created this for my own use and may make changes as I use it more, once I feel it is fully stable I will try add some some API documentation and samples for usage and testing. 







