ng-gauge
=============

> Angular.js directive to create a gauge component powered by d3.js based on http://radmie.github.io/ng-knob/ 

![screenshot](https://raw.githubusercontent.com/camilopalacios/ng-gauge/master/img/demo.PNG)

Features
-------
- very easy to implement
- without jQuery dependencies
- powered by d3.js
- 2-way data binding
- configurable minimum, maximum values and step
- animated
- configurable scale
- touch, click and drag events implemented

#### Dependencies

- AngularJS (tested with 1.4.x)
- D3.js (tested with 3.5.x)

#### Browser Support

- Chrome, Firefox, Safari, Opera, IE9+

Get started
-------

#### Installation
You can also use bower to install the component:
```bash
$ bower install ng-gauge --save
```

#### Usage

###### HTML:
```html
<body ng-app="GaugeDemoApp">
  <div ng-controller="GaugeController as gaugeCtrl">
    <ui-gauge value="gaugeCtrl.value" intervals="gaugeCtrl.intervals" options="gaugeCtrl.options"></ui-gauge>
  </div>
</body>

<script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.4.8/angular.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/d3/3.5.10/d3.min.js"></script>
<script src="bower_components/ng-gauge/dist/ng-gauge.min.js"></script>
```
###### Angular.js:

```javascript
angular
	.module('GaugeDemoApp', ['ui.gauge'])
	.controller('GaugeController',GaugeController);

function GaugeController() {
	var controller ={
		value: 50,
		intervals : {
			values: [0,10,20,30], // The interval is sorted and repeated values are removed
		},
		options : {
			needleColor: 'grey',
			min: 0,
			max: 100,
			// Other options...
		},
	};
	
	return controller;
}
```

Options
-------

###### You can pass these options to the initialize function to set a custom look and feel for the plugin.



License
-------

Licensed under the ISC license

