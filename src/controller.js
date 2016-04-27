angular
	.module('GaugeDemoApp', ['ui.gauge'])
	.controller('GaugeController',GaugeController);

function GaugeController() {

	var controller ={
		mockFunction: mockFunction,
		getParentSize: getParentSize,
		value: 65,
		intervals : {
			values: [0,10,20,30,40,10,10,10,10,10,10,50,60,70,80,90,100],
		},
		options : {
			needleColor: 'grey',
			//intervalColors: ['red','yellow','green', 'blue', 'purple', 'grey'],
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
			subText: {
				enabled: true,
				color: '#222',
				text: 'HDD space'
			},
			skin: {
				type: 'simple',
				width: 10,
				color: 'rgba(255,0,0,.5)',
				spaceWidth: 5
			},
			textColor: '#212121',
			step : 1,
			scale: {
				enabled: true,
				color: 'gray',
				width: 1,
				quantity: 12,
				height: 10,
				spaceWidth: 15
			},
		},
	};

	return controller;

	function getParentSize(){
		var element = document.getElementById('gaugeDiv'),
		style = window.getComputedStyle(element);
		var width = parseInt(style.getPropertyValue('width'), 10),
		height = parseInt(style.getPropertyValue('height'),10);
		return Math.min(width, height);
	};

	function mockFunction(){
		controller.intervals.values = [];
		controller.intervals.values.push(controller.options.min);
		for(var i=1; i < 9; i++){
			controller.intervals.values.push(Math.floor(Math.random()*10) * 10);
		}
		controller.intervals.values.push(controller.options.max);
	};
}
