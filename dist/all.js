;(function() {
"use strict";

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
			size: getParentSize(),
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
			unit: "%",
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
	};
}
}());

;(function() {
"use strict";

'use strict';

(function(){

  var ui = {};
  /**
   *   Constructor
   */

  function sortValues(a,b){
    return a - b;
  }

  function uniq(a) {
    return a.sort(sortValues).filter(function(item, pos, ary) {
        return !pos || item != ary[pos - 1];
    })
  }

  var Gauge = function(element, value, intervals, options) {
    this.element = element;
    this.value = value;
    this.intervals = intervals;
    //Sort and remove duplicated values
    this.intervals.values = uniq(this.intervals.values);
    this.colors = [];
    this.options = options;
    this.inDrag = false;
  };
  /**
   *   Convert from value to radians
   */
  Gauge.prototype.valueToRadians = function(value, valueEnd, angleEnd, angleStart, valueStart) {
    valueEnd = valueEnd || 100;
    valueStart = valueStart || 0;
    angleEnd = angleEnd || 360;
    angleStart = angleStart || 0;
    return (Math.PI/180) * ((((value - valueStart) * (angleEnd - angleStart)) / (valueEnd - valueStart)) + angleStart);
  };
  /**
   *   Convert from radians to value
   */
  Gauge.prototype.radiansToValue = function(radians, valueEnd, valueStart, angleEnd, angleStart) {
    valueEnd = valueEnd || 100;
    valueStart = valueStart || 0;
    angleEnd = angleEnd || 360;
    angleStart = angleStart || 0;
    return ((((((180/Math.PI) * radians) - angleStart) * (valueEnd - valueStart)) / (angleEnd - angleStart)) + valueStart);
  };
  /**
   *   Create the arc
   */
  Gauge.prototype.createArc = function(innerRadius, outerRadius, startAngle, endAngle, cornerRadius) {
    var arc = d3.svg.arc()
    .innerRadius(innerRadius)
    .outerRadius(outerRadius)
    .startAngle(startAngle)
    .endAngle(endAngle)
    .cornerRadius(cornerRadius);
    return arc;
  };

  /**
   *   Draw the line in the svg component
   */
  Gauge.prototype.drawLine = function(svg, data, label){
    var elem = svg.append("line")
    .attr('id', label)
    .attr({"x1": data[0].x,"y1": data[0].y, "x2": data[1].x, "y2": data[1].y})
    .attr("stroke-width", this.options.lineWidth)
    .attr("stroke", this.options.lineColor)
    .attr("stroke-linecap", "round");
    return elem;
  };

  /**
   *   Draw the line's axis in the middle of the gauge
   */
  Gauge.prototype.drawAxis = function(svg, label){
    var elem = svg.append('circle')
    .attr("id", label)
    .attr("cx", this.options.size/2)
    .attr("cy", this.options.size/2)
    .attr("r",  this.options.size*0.015)
    .attr("fill", this.options.lineColor)
    return elem;
  };

  /**
   *   Draw the arc
   */
  Gauge.prototype.drawArc = function(svg, arc, label, style, click, drag) {
    var elem = svg.append('path')
    .attr('id', label)
    .attr('d', arc)
    .style(style)
    .attr('transform', 'translate(' + (this.options.size / 2) + ', ' + (this.options.size / 2) + ')');

    if(this.options.readOnly === false) {
      if (click) {
        elem.on('click', click);
      }
      if (drag) {
        elem.call(drag);
      }
    }
    return elem;
  };


  /**
   *   Create the arcs
   */
  Gauge.prototype.createArcs = function() {
    var outerRadius = parseInt((this.options.size / 2), 10),
    startAngle = this.valueToRadians(this.options.startAngle, 360),
    endAngle = this.valueToRadians(this.options.endAngle, 360);
    if(this.options.scale.enabled) {
      outerRadius -= this.options.scale.height + this.options.scale.spaceWidth;
    }
    var trackInnerRadius = outerRadius - this.options.trackWidth,
    changeInnerRadius = outerRadius - this.options.barWidth,
    valueInnerRadius = outerRadius - this.options.barWidth,
    //interactInnerRadius = outerRadius - this.options.barWidth,
    interactInnerRadius = 1,

    trackOuterRadius = outerRadius,
    changeOuterRadius = outerRadius,
    valueOuterRadius = outerRadius,
    interactOuterRadius = outerRadius,
    diff;

    if(this.options.barWidth > this.options.trackWidth) {
      diff = (this.options.barWidth - this.options.trackWidth) / 2;
      trackInnerRadius -= diff;
      trackOuterRadius -= diff;
    } else if(this.options.barWidth < this.options.trackWidth) {
      diff = (this.options.trackWidth - this.options.barWidth) / 2;
      changeOuterRadius -= diff;
      valueOuterRadius -= diff;
      changeInnerRadius -= diff;
      valueInnerRadius -= diff;
      //interactInnerRadius = outerRadius - this.options.trackWidth;
    }

    this.intervalArcs = [];
    if(this.intervals.values.length != 0){

      // Creating colors if no colors have been set
      if(this.options.intervalColors.length == 0){
        var v, hue, minHue=0, maxHue=120;
        this.colors = [];
        for(var i=0; i < this.intervals.values.length-1; i++){
          v = (this.intervals.values[i] + this.intervals.values[i+1])/2;
          hue = ((((v - this.options.min) * (maxHue - minHue)) / (this.options.max - this.options.min)) + minHue);
          this.colors.push("hsl("+hue+",60%,50%)");
        }
      }
      // Repeating colors if there are more values than colors
      else if(this.options.intervalColors.length < this.intervals.values.length-1){
        var colors = [];
        for(var i=0; i < this.intervals.values.length - this.options.intervalColors.length-1; i++){
          colors.push(this.options.intervalColors[i % this.options.intervalColors.length]);
        }
        this.colors = this.options.intervalColors.concat(colors);
      }
      // There are enough colors already
      else{
        this.colors = this.options.intervalColors.slice();
      }

      // Creating arcs
      for(var i=0; i < this.intervals.values.length-1; i++){
        this.intervalArcs.push(this.createArc(outerRadius - (this.options.intervalWidth), outerRadius,
                                        this.valueToRadians(this.intervals.values[i], this.options.max, this.options.endAngle, this.options.startAngle, this.options.min),
                                        this.valueToRadians(this.intervals.values[i+1], this.options.max, this.options.endAngle, this.options.startAngle, this.options.min)
        ));
      }
    }

    if(this.options.bgColor) {
  		if(this.options.bgFull){
  			this.bgArc = this.createArc(0, outerRadius, 0, Math.PI*2);
  		}
  		else{
  			this.bgArc = this.createArc(0, outerRadius, startAngle, endAngle);
  		}
    }

    if(this.options.skin.type === 'tron') {
      trackOuterRadius = trackOuterRadius - this.options.skin.width - this.options.skin.spaceWidth;
      changeOuterRadius = changeOuterRadius - this.options.skin.width - this.options.skin.spaceWidth;
      valueOuterRadius = valueOuterRadius - this.options.skin.width - this.options.skin.spaceWidth;
      interactOuterRadius = interactOuterRadius - this.options.skin.width - this.options.skin.spaceWidth;
      this.hoopArc = this.createArc(outerRadius - this.options.skin.width, outerRadius, startAngle, endAngle);
    }

    this.trackArc = this.createArc(trackInnerRadius, trackOuterRadius, startAngle, endAngle, this.options.trackCap);
    this.changeArc = this.createArc(changeInnerRadius, changeOuterRadius, startAngle, startAngle, this.options.barCap);
    this.valueArc = this.createArc(valueInnerRadius, valueOuterRadius, startAngle, startAngle, this.options.barCap);
    this.interactArc = this.createArc(interactInnerRadius, interactOuterRadius, startAngle, endAngle);
  };

  /**
   *   Draw the arcs
   */
  Gauge.prototype.drawArcs = function(clickInteraction, dragBehavior) {
    var svg = d3.select(this.element)
    .append('svg')
    .attr("width", this.options.size)
    .attr("height", this.options.size);

    // Draws the background arc
    if(this.options.bgColor) {
      this.drawArc(svg, this.bgArc, 'bgArc', { "fill": this.options.bgColor });
    }

    // Draws the intervals arcs
    if(this.intervalArcs.length != 0){
      for(var i in this.intervalArcs){
        if(this.intervalArcs.hasOwnProperty(i)){
          this.drawArc(svg, this.intervalArcs[i], 'intervalArc' + i, { "fill": this.colors[i] });
        }
      }
    }

    if(this.options.displayInput) {
      // Display intervals
      for(var i = 0; i < this.intervals.values.length; i++){
        if(this.options.displayInput){
          if(this.intervals.values.hasOwnProperty(i)){
            var v = this.intervals.values[i];
            if (typeof this.options.inputFormatter === "function"){
                v = this.options.inputFormatter(v);
            }
            if(i < this.intervalArcs.length){
              // get the start angle of the arc
              var f = this.intervalArcs[i].startAngle();
            }
            else{
              // get the end angle of the arc
              var f = this.intervalArcs[i-1].endAngle();
            }
            var angle = (f() + Math.PI / 2);
            var fontSize = (this.options.size*0.05) + "px";
            svg.append('text')
            .attr('id', 'intervalText'+i)
            .attr('text-anchor', 'middle')
            .attr('font-size', fontSize)
            .attr('transform', 'translate(' + (this.options.size/2 - Math.cos(angle) * this.options.size/2.5) + ', ' + (this.options.size/2 - Math.sin(angle) * this.options.size/2.5) + ')')
            .style("fill", this.options.textColor)
            .text(this.intervals.values[i]);
          }
        }
      }

      var fontSize = (this.options.size*0.20) + "px";
      if(this.options.fontSize !== 'auto') {
        fontSize = this.options.fontSize + "px";
      }
      if(this.options.step < 1) {
        this.value = this.value.toFixed(1);
      }
      var v = this.value;
      if (typeof this.options.inputFormatter === "function"){
          v = this.options.inputFormatter(v);
      }
      svg.append('text')
      .attr('id', 'text')
      .attr("text-anchor", "middle")
      .attr("font-size", fontSize)
      .style("fill", this.options.textColor)
      .text(v + this.options.unit || "")
      .attr('transform', 'translate(' + ((this.options.size / 2)) + ', ' + ((this.options.size / 2) + (this.options.size*0.18)) + ')');

      if(this.options.subText.enabled) {
        fontSize = (this.options.size*0.07) + "px";
        if(this.options.subText.font !== 'auto') {
          fontSize = this.options.subText.font + "px";
        }
        svg.append('text')
        .attr('class', 'sub-text')
        .attr("text-anchor", "middle")
        .attr("font-size", fontSize)
        .style("fill", this.options.subText.color)
        .text(this.options.subText.text)
        .attr('transform', 'translate(' + ((this.options.size / 2)) + ', ' + ((this.options.size / 2) + (this.options.size*0.24)) + ')');
      }

    }
    if(this.options.scale.enabled) {
      var radius, quantity, count = 0, angle = 0, data,
      startRadians = this.valueToRadians(this.options.min, this.options.max, this.options.endAngle, this.options.startAngle, this.options.min),
      endRadians = this.valueToRadians(this.options.max, this.options.max, this.options.endAngle, this.options.startAngle, this.options.min),
      diff = 0;
      if(this.options.startAngle !== 0 || this.options.endAngle !== 360) {
        diff = 1;
      }
      if(this.options.scale.type === 'dots') {
        var width = this.options.scale.width;
        radius = (this.options.size / 2) - width;
        quantity = this.options.scale.quantity;
        var offset = radius + this.options.scale.width;
        data = d3.range(quantity).map(function () {
          angle = (count * (endRadians - startRadians)) - (Math.PI / 2) + startRadians;
          count = count + (1 / (quantity-diff));
          return {
            cx: offset + Math.cos(angle) * radius,
            cy: offset + Math.sin(angle) * radius,
            r: width
          };
        });
        svg.selectAll("circle")
        .data(data)
        .enter().append("circle")
        .attr({
          r: function (d) {
              return d.r;
          },
          cx: function (d) {
              return d.cx;
          },
          cy: function (d) {
              return d.cy;
          },
          fill: this.options.scale.color
        });
      } else if (this.options.scale.type === 'lines') {
        var height = this.options.scale.height;
        radius = (this.options.size / 2);
        quantity = this.options.scale.quantity;
        data = d3.range(quantity).map(function () {
          angle = (count * (endRadians - startRadians)) - (Math.PI / 2) + startRadians;
          count = count + (1 / (quantity-diff));
          return {
            x1: radius + Math.cos(angle) * radius,
            y1: radius + Math.sin(angle) * radius,
            x2: radius + Math.cos(angle) * (radius - height),
            y2: radius + Math.sin(angle) * (radius - height)
          };
        });
        svg.selectAll("line")
        .data(data)
        .enter().append("line")
        .attr({
          x1: function (d) {
              return d.x1;
          },
          y1: function (d) {
              return d.y1;
          },
          x2: function (d) {
              return d.x2;
          },
          y2: function (d) {
              return d.y2;
          },
          "stroke-width": this.options.scale.width,
          "stroke": this.options.scale.color
        });
      }
    }
    if(this.options.skin.type === 'tron') {
      this.drawArc(svg, this.hoopArc, 'hoopArc', { "fill": this.options.skin.color });
    }
    this.drawArc(svg, this.trackArc, 'trackArc', { "fill": this.options.trackColor });
    if(this.options.displayPrevious) {
      this.changeElem = this.drawArc(svg, this.changeArc, 'changeArc', { "fill": this.options.prevBarColor });
    } else {
      this.changeElem = this.drawArc(svg, this.changeArc, 'changeArc', { "fill-opacity": 0 });
    }
    this.valueElem = this.drawArc(svg, this.valueArc, 'valueArc', { "fill": this.options.barColor });

    var cursor = "pointer";
    if(this.options.readOnly) {
      cursor = "default";
    }

    this.drawArc(svg, this.interactArc, 'interactArc', { "fill-opacity": 0, "cursor": cursor }, clickInteraction, dragBehavior);
    // Draw the line
    var data = this.calculateLineData(this.valueToRadians(this.value, this.options.max, this.options.endAngle, this.options.startAngle, this.options.min));
    this.valueLine = this.drawLine(svg, data, 'line');
    this.drawAxis(svg, 'axis');
  };

  /*
   * Calculates the points to draw the line
   */
  Gauge.prototype.calculateLineData = function(value){
    var radius, radians, angle;
    angle = value - Math.PI / 2;
    radius = this.options.size/2;
    var data = [{"x": this.options.size/2, "y": this.options.size/2},
                {"x": radius + Math.cos(angle) * (radius - this.options.intervalWidth/2), "y": radius + Math.sin(angle) * (radius - this.options.intervalWidth/2)}];
    return data;
  };

  /**
   *   Draw gauge component
   */
  Gauge.prototype.draw = function(update) {
    d3.select(this.element).select("svg").remove();
    var that = this;

    that.createArcs();

    var dragBehavior = d3.behavior.drag()
    .on('drag', dragInteraction)
    .on('dragend', clickInteraction);

    that.drawArcs(clickInteraction, dragBehavior);

    if(that.options.animate.enabled) {
      that.valueElem.transition().ease(that.options.animate.ease).duration(that.options.animate.duration).tween('',function() {
        var i = d3.interpolate(that.valueToRadians(that.options.startAngle, 360), that.valueToRadians(that.value, that.options.max, that.options.endAngle, that.options.startAngle, that.options.min));
        return function(t) {
          var val = i(t);
          that.valueElem.attr('d', that.valueArc.endAngle(val));
          that.changeElem.attr('d', that.changeArc.endAngle(val));
          // Update the line's position
          var data = that.calculateLineData(val);
          that.valueLine.attr({"x1": data[0].x,"y1": data[0].y, "x2": data[1].x, "y2": data[1].y});
        };
      });
    } else {
      that.changeArc.endAngle(this.valueToRadians(this.value, this.options.max, this.options.endAngle, this.options.startAngle, this.options.min));
      that.changeElem.attr('d', that.changeArc);
      that.valueArc.endAngle(this.valueToRadians(this.value, this.options.max, this.options.endAngle, this.options.startAngle, this.options.min));
      that.valueElem.attr('d', that.valueArc);
    }

    function dragInteraction() {
      that.inDrag = true;
      var x = d3.event.x - (that.options.size / 2);
      var y = d3.event.y - (that.options.size / 2);
      interaction(x,y, false);
    }

    function clickInteraction() {
      that.inDrag = false;
      var coords = d3.mouse(this.parentNode);
      var x = coords[0] - (that.options.size / 2);
      var y = coords[1] - (that.options.size / 2);
      interaction(x,y, true);
    }

    function interaction(x,y, isFinal) {
      var arc = Math.atan(y/x)/(Math.PI/180), radians, delta;

      if ((x >= 0 && y <= 0) || (x >= 0 && y >= 0)) {
        delta = 90;
      } else {
        delta = 270;
        if(that.options.startAngle < 0) {
          delta = -90;
        }
      }

      radians = (delta + arc) * (Math.PI/180);
      that.value = that.radiansToValue(radians, that.options.max, that.options.min, that.options.endAngle, that.options.startAngle);
      if(that.value >= that.options.min && that.value <= that.options.max) {
        that.value = Math.round(((~~ (((that.value < 0) ? -0.5 : 0.5) + (that.value/that.options.step))) * that.options.step) * 100) / 100;
        if(that.options.step < 1) {
          that.value = that.value.toFixed(1);
        }
        update(that.value);
        that.valueArc.endAngle(that.valueToRadians(that.value, that.options.max, that.options.endAngle, that.options.startAngle, that.options.min));
        that.valueElem.attr('d', that.valueArc);
        // Update the line's position
        var data = that.calculateLineData(that.valueToRadians(that.value, that.options.max, that.options.endAngle, that.options.startAngle, that.options.min));
        that.valueLine.attr({"x1": data[0].x,"y1": data[0].y, "x2": data[1].x, "y2": data[1].y});

        if (isFinal) {
          that.changeArc.endAngle(that.valueToRadians(that.value, that.options.max, that.options.endAngle, that.options.startAngle, that.options.min));
          that.changeElem.attr('d', that.changeArc);
        }
        if(that.options.displayInput) {
          var v = that.value;
          if (typeof that.options.inputFormatter === "function"){
            v = that.options.inputFormatter(v);
          }
          d3.select(that.element).select('#text').text(v + that.options.unit || "");
        }
      }
    }
  };
  /**
   *   Set a value
   */
  Gauge.prototype.setValue = function(newValue) {
    if ((!this.inDrag) && this.value >= this.options.min && this.value <= this.options.max) {
      var radians = this.valueToRadians(newValue, this.options.max, this.options.endAngle, this.options.startAngle, this.options.min);
      this.value = Math.round(((~~ (((newValue < 0) ? -0.5 : 0.5) + (newValue/this.options.step))) * this.options.step) * 100) / 100;
      if(this.options.step < 1) {
        this.value = this.value.toFixed(1);
      }
      this.changeArc.endAngle(radians);
      d3.select(this.element).select('#changeArc').attr('d', this.changeArc);
      this.valueArc.endAngle(radians);
      d3.select(this.element).select('#valueArc').attr('d', this.valueArc);
      // Update the line's position
      var data = this.calculateLineData(this.valueToRadians(this.value, this.options.max, this.options.endAngle, this.options.startAngle, this.options.min));
      this.valueLine.attr({"x1": data[0].x,"y1": data[0].y, "x2": data[1].x, "y2": data[1].y});

      if(this.options.displayInput) {
        var v = this.value;
        if (typeof this.options.inputFormatter === "function"){
          v = this.options.inputFormatter(v);
        }
        d3.select(this.element).select('#text').text(v + this.options.unit || "");
      }
    }
  };

  ui.Gauge = Gauge;
  /**
   *   Angular gauge directive
   */
  ui.gaugeDirective = function() {
    return  {
      restrict: 'E',
      scope: {
        value: '=',
        intervals: '=',
        options: '='
      },
      link: function (scope, element) {
        //scope.colors = scope.options.intervalColors;
        //scope.colors = [];
        scope.value = scope.value || 0;
        var defaultIntervals = {
          values : [],
        };
        scope.intervals = angular.merge(defaultIntervals, scope.intervals);
        var defaultOptions = {
          lineColor: 'grey',
          lineWidth: 0,
          intervalWidth: 20,
          intervalColors: [],
          skin: {
            type: 'simple',
            width: 10,
            color: 'rgba(255,0,0,.5)',
            spaceWidth: 5
          },
          animate: {
            enabled: true,
            duration: 1000,
            ease: 'bounce'
          },
          size: 400,
          startAngle: -90,
          endAngle: 90,
          unit: "",
          displayInput: true,
          inputFormatter: function(v){ return v; },
          readOnly: false,
          trackWidth: 0,
          barWidth: 0,
          trackColor: "rgba(0,0,0,0)",
          barColor: "rgba(255,0,0,.5)",
          prevBarColor: "rgba(0,0,0,0)",
          textColor: '#222',
          barCap: 0,
		      trackCap: 0,
          fontSize: 'auto',
          subText: {
            enabled: false,
            text: "",
            color: "grey",
            font: "auto"
          },
          bgColor: '',
		      bgFull: false,
          scale: {
            enabled: false,
            type: 'lines',
            color: 'gray',
            width: 4,
            quantity: 20,
            height: 10,
            spaceWidth: 15
          },
          step: 1,
          displayPrevious: false,
          min: 0,
          max: 100,
          dynamicOptions: false
				};
        scope.options = angular.merge(defaultOptions, scope.options);

        var gauge = new ui.Gauge(element[0], scope.value, scope.intervals, scope.options);

        scope.$watch('value', function(newValue, oldValue) {
          if((newValue !== null || typeof newValue !== 'undefined') && typeof oldValue !== 'undefined' && newValue !== oldValue) {
            gauge.setValue(newValue);
          }
        });

        var isFirstWatchOnIntervals = true;
        scope.$watch('intervals', function() {
          if (isFirstWatchOnIntervals) {
            isFirstWatchOnIntervals = false;
          } else {
            var newIntervals = angular.merge(defaultIntervals, scope.intervals);
            gauge = new ui.Gauge(element[0], scope.value, newIntervals, scope.options);
            drawGauge();
          }
        }, true);

        if(scope.options.dynamicOptions) {
          var isFirstWatchOnOptions = true;
          scope.$watch('options', function() {
              if (isFirstWatchOnOptions) {
                isFirstWatchOnOptions = false;
              } else {
                var newOptions = angular.merge(defaultOptions, scope.options);
                gauge = new ui.Gauge(element[0], scope.value, scope.intervals, newOptions);
                drawGauge();
              }
          }, true);
        }

        var drawGauge = function(){
          gauge.draw(function(value) {
            scope.$apply(function() {
              scope.value = value;
            });
          });
        };

        drawGauge();

      }
    };
  };

  angular.module('ui.gauge', []).directive('uiGauge', ui.gaugeDirective);
})();
}());
