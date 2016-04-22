angular
	.module('GaugeDemoApp', ['ui.gauge'])
	.controller('GaugeController',GaugeController);

function GaugeController() {

	var controller ={
		mockFunction: mockFunction,
		getParentSize: getParentSize,
		value: 50,
		intervals : {
			values: [0,10,20,30,40,10,10,10,10,10,10,50,60,70,80,90,100],
		},
		options : {
			//size: getParentSize(),
			lineColor: 'grey',
			lineWidth: 5,
			//intervalColors: ['red','yellow','green', 'blue', 'purple', 'grey'],
			min: 0,
			max: 100,
			startAngle:-90,
			endAngle:90,
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
			bgColor: "#f5f5f0",
			step : 1,
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

		console.log();
	};
}
