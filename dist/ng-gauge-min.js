"use strict";!function(){function t(t,i){return t-i}function i(i){return i.sort(t).filter(function(t,i,s){return!i||t!=s[i-1]})}var s={},e=function(t,s,e,n){this.element=t,this.value=s,this.intervals=e,this.intervals.values=i(this.intervals.values),this.colors=[],this.options=n,this.size,this.svg,this.inDrag=!1,this.outerRadius};e.prototype.valueToRadians=function(t,i,s,e,n){return i=i||100,n=n||0,s=s||360,e=e||0,Math.PI/180*((t-n)*(s-e)/(i-n)+e)},e.prototype.radiansToValue=function(t,i,s,e,n){return i=i||100,s=s||0,e=e||360,n=n||0,(180/Math.PI*t-n)*(i-s)/(e-n)+s},e.prototype.createArc=function(t,i,s,e,n){var o=d3.svg.arc().innerRadius(t).outerRadius(i).startAngle(s).endAngle(e).cornerRadius(n);return o},e.prototype.drawNeedle=function(t,i,s){var e=["M "+this.size/2+","+this.size/10+"L "+(this.size/2-this.size/2*.02)+","+this.size/2+"L "+(this.size/2+this.size/2*.02)+","+this.size/2+"L "+this.size/2+","+this.size/10+"Z"],n=t.append("path").attr("id",i).attr("d",e).attr("stroke",this.options.needleColor).attr("fill",this.options.needleColor).attr("transform","rotate("+s+" "+this.size/2+" "+this.size/2+")");return n},e.prototype.drawAxis=function(t,i){var s=t.append("circle").attr("id",i).attr("cx",this.size/2).attr("cy",this.size/2).attr("r",.02*this.size).attr("fill",this.options.needleColor);return s},e.prototype.drawArc=function(t,i,s,e,n,o){var a=t.append("path").attr("id",s).attr("d",i).style(e).attr("transform","translate("+this.size/2+", "+this.size/2+")");return this.options.readOnly===!1&&(n&&a.on("click",n),o&&a.call(o)),a},e.prototype.createArcs=function(){this.svg=d3.select(this.element).append("svg").attr({width:"100%",height:"100%"}),this.size=Math.min(parseInt(this.svg.style("width"),10),parseInt(this.svg.style("height"),10)),this.svg.attr("viewBox","0 0 "+this.size+" "+this.size),this.outerRadius=parseInt(this.size/2,10);var t,i=this.valueToRadians(this.options.startAngle,360),s=this.valueToRadians(this.options.endAngle,360),e=this.outerRadius-this.options.trackWidth,n=this.outerRadius-this.options.barWidth,o=this.outerRadius-this.options.barWidth,a=1,r=this.outerRadius,h=this.outerRadius,l=this.outerRadius,p=this.outerRadius;if(this.options.barWidth>this.options.trackWidth?(t=(this.options.barWidth-this.options.trackWidth)/2,e-=t,r-=t):this.options.barWidth<this.options.trackWidth&&(t=(this.options.trackWidth-this.options.barWidth)/2,h-=t,l-=t,n-=t,o-=t),this.intervalArcs=[],0!=this.intervals.values.length){if(0==this.options.intervalColors.length){var u,c,v=0,d=120;this.colors=[];for(var g=0;g<this.intervals.values.length-1;g++)u=(this.intervals.values[g]+this.intervals.values[g+1])/2,c=(u-this.options.min)*(d-v)/(this.options.max-this.options.min)+v,this.colors.push("hsl("+c+",60%,50%)")}else if(this.options.intervalColors.length<this.intervals.values.length-1){for(var A=[],g=0;g<this.intervals.values.length-this.options.intervalColors.length-1;g++)A.push(this.options.intervalColors[g%this.options.intervalColors.length]);this.colors=this.options.intervalColors.concat(A)}else this.colors=this.options.intervalColors.slice();for(var m=this.outerRadius/18,g=0;g<this.intervals.values.length-1;g++)this.intervalArcs.push(this.createArc(this.outerRadius-m,this.outerRadius,this.valueToRadians(this.intervals.values[g],this.options.max,this.options.endAngle,this.options.startAngle,this.options.min),this.valueToRadians(this.intervals.values[g+1],this.options.max,this.options.endAngle,this.options.startAngle,this.options.min)))}this.options.bgColor&&(this.options.bgFull?this.bgArc=this.createArc(0,this.outerRadius,0,2*Math.PI):this.bgArc=this.createArc(0,this.outerRadius,i,s)),this.trackArc=this.createArc(e,r,i,s,this.options.trackCap),this.changeArc=this.createArc(n,h,i,i,this.options.barCap),this.valueArc=this.createArc(o,l,i,i,this.options.barCap),this.interactArc=this.createArc(a,p,i,s)},e.prototype.drawArcs=function(t,i){if(this.options.bgColor&&this.drawArc(this.svg,this.bgArc,"bgArc",{fill:this.options.bgColor}),0!=this.intervalArcs.length)for(var s in this.intervalArcs)this.intervalArcs.hasOwnProperty(s)&&this.drawArc(this.svg,this.intervalArcs[s],"intervalArc"+s,{fill:this.colors[s]});if(this.options.displayInput){for(var s=0;s<this.intervals.values.length;s++)if(this.options.displayInput&&this.intervals.values.hasOwnProperty(s)){var e=this.intervals.values[s];if("function"==typeof this.options.intervalFormatter&&(e=this.options.intervalFormatter(e)),s<this.intervalArcs.length)var n=this.intervalArcs[s].startAngle();else var n=this.intervalArcs[s-1].endAngle();var o=n()+Math.PI/2,a=.05*this.size+"px";this.svg.append("text").attr("id","intervalText"+s).attr("text-anchor","middle").attr("font-size",a).attr("transform","translate("+(this.size/2-Math.cos(o)*this.size/2.65)+", "+(this.size/2-Math.sin(o)*this.size/2.65)+")").style("fill",this.options.textColor).text(e)}var a=.2*this.size+"px";"auto"!==this.options.fontSize&&(a=this.options.fontSize+"px"),this.options.step<1&&(this.value=this.value.toFixed(1));var e=this.value;"function"==typeof this.options.mainFormatter&&(e=this.options.mainFormatter(e)),this.svg.append("text").attr("id","text").attr("text-anchor","middle").attr("font-size",a).style("fill",this.options.textColor).text(e+this.options.unit||"").attr("transform","translate("+this.size/2+", "+(this.size/2+.18*this.size)+")"),e=this.options.subText.text,"function"==typeof this.options.subTextFormatter&&(e=this.options.subTextFormatter(e)),this.options.subText.enabled&&(a=.07*this.size+"px","auto"!==this.options.subText.font&&(a=this.options.subText.font+"px"),this.svg.append("text").attr("class","sub-text").attr("text-anchor","middle").attr("font-size",a).style("fill",this.options.subText.color).text(e).attr("transform","translate("+this.size/2+", "+(this.size/2+.24*this.size)+")"))}if(this.options.scale.enabled){var r,h,l,p=0,o=0,u=this.valueToRadians(this.options.min,this.options.max,this.options.endAngle,this.options.startAngle,this.options.min),c=this.valueToRadians(this.options.max,this.options.max,this.options.endAngle,this.options.startAngle,this.options.min),v=0;(0!==this.options.startAngle||360!==this.options.endAngle)&&(v=1);var d=this.outerRadius;r=this.size/2,h=this.options.max+1,l=d3.range(h).map(function(){return o=p*(c-u)-Math.PI/2+u,p+=1/(h-v),{x1:r+Math.cos(o)*(r-.07*d),y1:r+Math.sin(o)*(r-.07*d),x2:r+Math.cos(o)*(r-.12*d),y2:r+Math.sin(o)*(r-.12*d)}}),this.svg.selectAll("line.values").data(l).enter().append("line").attr({x1:function(t){return t.x1},y1:function(t){return t.y1},x2:function(t){return t.x2},y2:function(t){return t.y2},"stroke-width":this.options.scale.width,stroke:this.options.scale.color});var g=this.outerRadius;r=this.size/2,l=[];for(var s=0;s<this.intervals.values.length;s++)o=this.valueToRadians(this.intervals.values[s],this.options.max,this.options.endAngle,this.options.startAngle,this.options.min)-Math.PI/2,l.push({x1:r+Math.cos(o)*(r-.07*g),y1:r+Math.sin(o)*(r-.07*g),x2:r+Math.cos(o)*(r-.16*g),y2:r+Math.sin(o)*(r-.16*g)});this.svg.selectAll("line.intervals").data(l).enter().append("line").attr({x1:function(t){return t.x1},y1:function(t){return t.y1},x2:function(t){return t.x2},y2:function(t){return t.y2},"stroke-width":2*this.options.scale.width,stroke:this.options.scale.color})}this.drawArc(this.svg,this.trackArc,"trackArc",{fill:this.options.trackColor}),this.options.displayPrevious?this.changeElem=this.drawArc(this.svg,this.changeArc,"changeArc",{fill:this.options.prevBarColor}):this.changeElem=this.drawArc(this.svg,this.changeArc,"changeArc",{"fill-opacity":0}),this.valueElem=this.drawArc(this.svg,this.valueArc,"valueArc",{fill:this.options.barColor});var A="pointer";this.options.readOnly&&(A="default"),this.drawArc(this.svg,this.interactArc,"interactArc",{"fill-opacity":0,cursor:A},t,i);var m=180*this.valueToRadians(this.value,this.options.max,this.options.endAngle,this.options.startAngle,this.options.min)/Math.PI;this.valueNeedle=this.drawNeedle(this.svg,"needle",m),this.drawAxis(this.svg,"axis")},e.prototype.draw=function(t){function i(){n.inDrag=!0;var t=d3.event.x-n.size/2,i=d3.event.y-n.size/2;e(t,i,!1)}function s(){n.inDrag=!1;var t=d3.mouse(this.parentNode),i=t[0]-n.size/2,s=t[1]-n.size/2;e(i,s,!0)}function e(i,s,e){var o,a,r=Math.atan(s/i)/(Math.PI/180);if(i>=0&&0>=s||i>=0&&s>=0?a=90:(a=270,n.options.startAngle<0&&(a=-90)),o=(a+r)*(Math.PI/180),n.value=n.radiansToValue(o,n.options.max,n.options.min,n.options.endAngle,n.options.startAngle),n.value>=n.options.min&&n.value<=n.options.max){n.value=Math.round(~~((n.value<0?-.5:.5)+n.value/n.options.step)*n.options.step*100)/100,n.options.step<1&&(n.value=n.value.toFixed(1)),t(n.value),n.valueArc.endAngle(n.valueToRadians(n.value,n.options.max,n.options.endAngle,n.options.startAngle,n.options.min)),n.valueElem.attr("d",n.valueArc);var h=180*n.valueToRadians(n.value,n.options.max,n.options.endAngle,n.options.startAngle,n.options.min)/Math.PI;if(n.valueNeedle.attr("transform","rotate("+h+" "+n.size/2+" "+n.size/2+")"),e&&(n.changeArc.endAngle(n.valueToRadians(n.value,n.options.max,n.options.endAngle,n.options.startAngle,n.options.min)),n.changeElem.attr("d",n.changeArc)),n.options.displayInput){var l=n.value;"function"==typeof n.options.mainFormatter&&(l=n.options.mainFormatter(l)),d3.select(n.element).select("#text").text(l+n.options.unit||"")}}}d3.select(this.element).select("svg").remove();var n=this;n.createArcs();var o=d3.behavior.drag().on("drag",i).on("dragend",s);n.drawArcs(s,o),n.options.animate.enabled?n.valueElem.transition().ease(n.options.animate.ease).duration(n.options.animate.duration).tween("",function(){var t=d3.interpolate(n.valueToRadians(n.options.startAngle,360),n.valueToRadians(n.value,n.options.max,n.options.endAngle,n.options.startAngle,n.options.min));return function(i){var s=t(i);n.valueElem.attr("d",n.valueArc.endAngle(s)),n.changeElem.attr("d",n.changeArc.endAngle(s));var e=180*s/Math.PI;n.valueNeedle.attr("transform","rotate("+e+" "+n.size/2+" "+n.size/2+")")}}):(n.changeArc.endAngle(this.valueToRadians(this.value,this.options.max,this.options.endAngle,this.options.startAngle,this.options.min)),n.changeElem.attr("d",n.changeArc),n.valueArc.endAngle(this.valueToRadians(this.value,this.options.max,this.options.endAngle,this.options.startAngle,this.options.min)),n.valueElem.attr("d",n.valueArc))},e.prototype.setValue=function(t){if(!this.inDrag&&this.value>=this.options.min&&this.value<=this.options.max){var i=this.valueToRadians(t,this.options.max,this.options.endAngle,this.options.startAngle,this.options.min);this.value=Math.round(~~((0>t?-.5:.5)+t/this.options.step)*this.options.step*100)/100,this.options.step<1&&(this.value=this.value.toFixed(1)),this.changeArc.endAngle(i),d3.select(this.element).select("#changeArc").attr("d",this.changeArc),this.valueArc.endAngle(i),d3.select(this.element).select("#valueArc").attr("d",this.valueArc);var s=180*this.valueToRadians(this.value,this.options.max,this.options.endAngle,this.options.startAngle,this.options.min)/Math.PI;if(this.valueNeedle.attr("transform","rotate("+s+" "+this.size/2+" "+this.size/2+")"),this.options.displayInput){var e=this.value;"function"==typeof this.options.mainFormatter&&(e=this.options.mainFormatter(e)),d3.select(this.element).select("#text").text(e+this.options.unit||"")}}},s.Gauge=e,s.gaugeDirective=function(){return{restrict:"E",scope:{value:"=",intervals:"=",options:"="},link:function(t,i){t.value=t.value||0;var e={values:[]};t.intervals=angular.merge(e,t.intervals);var n={needleColor:"grey",intervalColors:[],skin:{type:"simple",width:10,color:"rgba(255,0,0,.5)",spaceWidth:5},animate:{enabled:!0,duration:1e3,ease:"bounce"},startAngle:-90,endAngle:90,unit:"",displayInput:!0,mainFormatter:function(t){return"main "+t},subTextFormatter:function(t){return"sub "+t},intervalFormatter:function(t){return"intr"+t},readOnly:!1,trackWidth:0,barWidth:0,trackColor:"rgba(0,0,0,0)",barColor:"rgba(255,0,0,.5)",prevBarColor:"rgba(0,0,0,0)",textColor:"#222",barCap:0,trackCap:0,fontSize:"auto",subText:{enabled:!1,text:"",color:"grey",font:"auto"},bgColor:"",bgFull:!1,scale:{enabled:!1,type:"none",color:"gray",width:4,quantity:20,height:10,spaceWidth:15},step:1,displayPrevious:!1,min:0,max:100,dynamicOptions:!1};t.options=angular.merge(n,t.options);var o=new s.Gauge(i[0],t.value,t.intervals,t.options);t.$watch("value",function(t,i){null===t&&"undefined"==typeof t||"undefined"==typeof i||t===i||o.setValue(t)});var a=!0;if(t.$watch("intervals",function(){if(a)a=!1;else{var n=angular.merge(e,t.intervals);o=new s.Gauge(i[0],t.value,n,t.options),h()}},!0),t.options.dynamicOptions){var r=!0;t.$watch("options",function(){if(r)r=!1;else{var e=angular.merge(n,t.options);o=new s.Gauge(i[0],t.value,t.intervals,e),h()}},!0)}var h=function(){o.draw(function(i){t.$apply(function(){t.value=i})})};h()}}},angular.module("ui.gauge",[]).directive("uiGauge",s.gaugeDirective)}();