;(function() {
"use strict";

angular
	.module('GaugeDemoApp', ['ui.gauge'])
	.controller('GaugeController',GaugeController);

function GaugeController() {

	var controller ={
		value: 50,
		intervals : {
			values: [0,10,20,30,40,10,10,10,10,10,10,50,60,70,80,90,100], // The interval is sorted and repeated values are removed
		},
		options : {
			needleColor: 'grey',
			min: 0,
			max: 100,
			startAngle:-120,
			endAngle:120,
			animate: {
				enabled: true,
				duration: 1000,
				ease: 'bounce'
			},
			displayInput: true,
			mainFormatter: function(v){return v;},
			subTextFormatter: function(v){return v;},
			intervalFormatter: function(v){return v;},
			readOnly: false,
			subText: {
				enabled: true,
				color: '#222',
				text: 'km/h'
			},
			textColor: '#212121',
		},
		randomIntervals: randomIntervals,
	};

	return controller;

	function randomIntervals(){
		controller.intervals.values = [];
		controller.intervals.values.push(controller.options.min);
		for(var i=1; i < 9; i++){
			controller.intervals.values.push(Math.floor(Math.random()*10) * 10);
		}
		controller.intervals.values.push(controller.options.max);
	};
}
}());
