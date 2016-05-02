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

| Property         | Type         | Default      | Description      |
|------------------|--------------|--------------|------------------|
| animate          | object       | { enabled: true, duration: 1000, ease: 'bounce' }| Duration in milliseconds, Ease: `linear`, `bounce`, `sin`, `cubic`, `quad`, `exp`, `circle`  |
| startAngle	   | integer      | -120	 | Start angle in degrees |
| endAngle         | integer      | 120          | End angle in degrees   |
| unit             | string       | ''           | Unit values            |
| displayInput     | boolean      | true         | Display input value (`true` or `false`) |
| inputFormatter   | function     | function(value){ return value; }      | Formats the input value **before appending the `unit`** and displaying it to the DOM |
| readOnly         | boolean      | true         | Disabled change value (`true` or `false`) |
| textColor        | string       | '#222'	 | Text color             |
| fontSize         | string       | 'auto'       | Font size in px. `auto`: automatic change |
| subText          | object       | { enabled: false, text: '', color: 'gray', font: 'auto' } | Subtext options |
| scale            | object       | { enabled: true, color: 'gray', width: 1} | Scale options |
| step             | integer      | 1            | Step change, min `0.1`     |
| min              | integer      | 0            | Min value (start value), only integer      |
| max              | integer      | 100          | Max value (end value), only integer        |
| dynamicOptions   | boolean      | false        | Dynamic change options (`true` or `false`) |

License
-------

Licensed under the ISC license
