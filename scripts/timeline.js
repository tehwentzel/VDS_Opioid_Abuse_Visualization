var App = App || {};

Date.prototype.addDays = function(days) {
	//helper function to add on days to a date object
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
}

class TimeLine {
	constructor(pat_id, prescriptions, start_date_filter = null){
		this.prescriptions = prescriptions
		this.height = 140;
		this.baseColor = '#2ca25f';
		this.maxDays = 365;
		this.start_date_filter = start_date_filter;
		if(start_date_filter != null){
			this.start_date = new Date(start_date_filter);
		} else{ this.start_date = null }
		this.drugName = null;
		
		this.div = d3.select("#gantt-chart")
			.append('div')
			.attr('class','tooltip')
			.style('opacity', 0);
		this.svg = d3.select("#gantt-chart")
			.append('svg')
			.attr('width','90%')
			.attr('height', this.height + 'px');
		this.width = this.svg.node().clientWidth;
		this.setID(pat_id)
	}
	
	setID(pat_id, start_date = null) {
		this.id = pat_id;	
		this.allData = this.prescriptions.filter( script => script.pat_id == this.id );
		//format data
		this.allData.forEach(function(d){
				d.filldate = new Date(d.filldate);
				d.final_date = new Date(d.final_date).addDays(1);
				d.rxcount = +d.rxcount;
				d.days_supply = +d.days_supply;
			});

		this.runFilters();
		this.setupDrugFilter();
		this.setupTimeFilter();
	}
	
	runFilters(){
		if( this.drugName != null ){
			this.data = this.allData.filter(d => 
				this.drugName == d.nonproprietaryname.split(" ")[0]
				);
		} else { this.data = this.allData; }
		
		this.start_date = d3.min(this.data, 
			function(d){return d.filldate;});
		if( (this.start_date_filter != null) & (this.start_date < this.start_date_filter) ){
			this.start_date = this.start_date_filter;
		}
		this.end_date = d3.max(this.data, 
			function(d){return d.final_date;});	
		if( d3.timeDay.count( this.start_date, this.end_date ) > this.maxDays ){
			this.end_date = new Date(this.start_date).addDays( this.maxDays );
		}
		console.log(this.end_date);
		console.log(this.data);
		this.data = this.data.filter(d => d.filldate <= this.end_date)
			.filter(d => d.final_date > this.start_date);
		this.data.forEach(function(d){
			d.cutoff_date = d.final_date;
			if(d.final_date > this.end_date){
				d.cutoff_date = this.end_date;
			}
			d.begin_date = d.filldate;
			if(this.start_date > d.begin_date){
				d.begin_date = this.start_date;
			}
		}, this);
		this.drawSvg();
		this.drawRects();
	}
	
	drawSvg(){
		//draw axis
		this.xAxis = d3.scaleTime()
			.domain( [this.start_date, this.end_date] )
			.range( [0, .9*this.width] );
		this.data.forEach(function(d){
			d.startPos = this.xAxis(d.begin_date) + .051*this.width;
			d.endPos = this.xAxis(d.cutoff_date) + .051*this.width;
		}, this);
		//console.log(this.data)
		this.svg.selectAll(".timeAxis").remove();
		this.svg.append("g")
			.attr("class", "timeAxis")
			.attr("transform", "translate(" + .051*this.width + "," + .85*this.height + " )")
			.call( d3.axisBottom(this.xAxis) );
		//maps a map of {time: number of active prescription}
		this.time = d3.timeDay.range(this.start_date, this.end_date);
		this.time.forEach(function(given_day){
			given_day.count = 0;
			given_day.xPos = this.xAxis(given_day) + .051*this.width;
			//console.log(this.xAxis(given_day));
			this.data.forEach(function(rx){
				if(rx.filldate <= given_day && rx.final_date > given_day){
					given_day.count += 1;
				}
			}, given_day);
		}, this);
		//console.log(this.time);
	}
	
	drawRects(){
		var stepSize = 30;
		var nodes = this.svg.selectAll("rect.timeRectangle")
			.data(this.time, function(d) {return d;});
		var barWidth =  .9*this.width/this.time.length;
		nodes.exit().remove();
		nodes.enter().append('rect').merge(nodes)
			.attr('class','timeRectangle')
			.attr('x', function(d){return d.xPos;})
			.attr('y', function(d){ return 120 - 30*d.count; } )
			.attr('height', function(d){return stepSize*d.count;})
			.attr('width', barWidth)
			.attr('fill', this.baseColor)
			.attr('fill-opacity', .5);
		var visitWidth = .5*barWidth;
		if(barWidth > 10){
			visitWidth = 5;
		}
		this.svg.selectAll('.visit').remove();
		var visits = this.svg.selectAll('rect.visit')
			.data(this.data, function(d) { return d.filldate; })
			.enter()
			.append('g')
			.attr('class','visit');
		console.log(this.data);
		visits.append('rect')
			.attr('class', 'fillperiod')
			.attr('y', function(d) {return 90;})
			.attr('x', function(d) {return d.startPos - .8*visitWidth; })
			.attr('height', 30)
			.attr('width', function(d) {return d.endPos - d.startPos; })
			.attr('fill', 'blue')
			.attr('fill-opacity', 0)
			.attr('style', 'stroke-width:2;stroke:blue;stroke-opacity:0');
		console.log('bars');
		visits.append('rect')
			.attr('class','fillstart')
			.attr('y', function(d) {return 90;})
			.attr('x', function(d){ return d.startPos - .5*visitWidth; })
			.attr('height', 30)
			.attr('width', visitWidth)
			.attr('fill', 'red');
		var div = this.div
		d3.selectAll('.visit').on("mouseover", function(d){
			d3.select(this).select('.fillperiod')
				.attr('style', 'stroke-width:2;stroke:blue;stroke-opacity:1');
			div.transition().duration(100).style('opacity',.9);
			div.html( "Drug: " + d.nonproprietaryname.split(' ')[0] + '<br/>'
				+ "rx Count: " + d.rxcount + '<br/>'
				+ "physician ID: " + d.physiciannpi + "<br/>"
				+ "Fill Date: " + d.filldate.toDateString() + '<br/>'
				+ "Script Duration: " + d.days_supply + " days" +'<br/>')
				.style('left', d3.event.clientX + 'px')
				.style('top', 2.3*stepSize + 'px');
			
			d3.selectAll('.visit').on("mousemove", function(){
				div.style('left', d3.event.clientX + 'px')
					.style('top', 2.3*stepSize + 'px');
			});
		}).on("mouseout", function(){
			d3.select(this).select('.fillperiod')
				.attr('style', 'stroke-width:2;stroke:blue;stroke-opacity:0');
			div.transition().duration(200)
				.style('opacity', 0);
		});
	}
	
	setupDrugFilter(target = '#gantt-filters'){
		var filters = this.getDrugNames();
		d3.selectAll('.drugFilter').remove();
		var selectionBox = d3.selectAll(target).append('div')
			.attr('class','drugFilter flex-container');
		selectionBox.append('p')
			.style('text-align', 'center')
			.html("Filter By Drug:");
		var selectionMenu = selectionBox.append('select')
			.style('margin', '0 auto')
			.style('display', 'block');
		selectionMenu.selectAll('option')
			.data(filters)
			.enter()
			.append('option')
			.attr('value', function(d){ return d;})
			.html( function(d){return d;});
		var self = this;
		selectionMenu.on('change', function(d){
			var drugNameSelection = d3.select(this).node().value;
			self.setDrug(drugNameSelection);
			self.setupTimeFilter();
		});
	}
	
	setupTimeFilter(target = '#gantt-filters'){
		var height = 100;
		var yPosition = .5;
		var rectHeightScale = .25;
		var tempData;
		if( this.drugName != null ){
			tempData = this.allData.filter(d => 
				this.drugName == d.nonproprietaryname.split(" ")[0]
				);
		} else { tempData = this.allData; }
		var minDate = d3.min(tempData, 
			function(d){return d.filldate;});
		var maxDate = d3.max(tempData,
			function(d){return d.final_date;});
			d3.selectAll(target).selectAll('.slider').remove()
		var box = d3.selectAll(target);
		var width = .9*box.node().clientWidth;
		var xOffset = .05*width;
		console.log(width);
		var slideAxis = d3.scaleTime()
			.domain( [minDate, maxDate] )
			.range( [0, .9*width ] );
		d3.selectAll('.timeSelection').remove();
		var sliderSvg = box.append('svg')
			.attr('class', 'timeSelection')
			.attr('width', box.node().clientWidth)
			.attr('height', height + "px");
		sliderSvg.append("g")
			.attr("class", "sliderAxis")
			.attr("transform", "translate(" + xOffset + "," + yPosition*height + " )")
			.call( d3.axisBottom(slideAxis));
			
		var timeLine = d3.timeDay.range( minDate, maxDate );
		console.log(timeLine);
		var sectionWidth = .9*width/(timeLine.length);
		console.log(width);
		self = this;
		var selectionRectangles = sliderSvg.selectAll('rect.selectionRectangles')
			.data(timeLine)
			.enter()
			.append('rect')
			.attr('class','selectionRectangles')
			.attr('height', rectHeightScale*height)
			.attr('width', sectionWidth)
			.attr('y', (yPosition-rectHeightScale)*height)
			.attr('x', function(d) {return slideAxis(d) + xOffset})
			.style('fill','blue')
			.style('fill-opacity', function(d){
				if(self.start_date <= d && self.end_date > d){
					return .8;
				}
				else{ return .2; }
			})

		var pressed = [0, 0];
		var slideRectangles = sliderSvg.selectAll('rect.dragRectangles')
			.data([self.start_date, self.end_date]);
		slideRectangles.enter().merge(slideRectangles)
			.append('rect')
			.attr('class','dragRectangles')
			.attr('height', rectHeightScale*height)
			.attr('width', .5*sectionWidth)
			.attr('y', (yPosition - rectHeightScale)*height)
			.attr('x', function(d) {return slideAxis(d)- .15*sectionWidth + xOffset;})
			.style('fill', 'darkblue')
			.on('mousedown',function(g,i) {
				var handle = d3.select(this);
				d3.event.preventDefault();
				pressed[i] = 1;
				selectionRectangles.on('mouseover',function(d){
					var update = function(){
						selectionRectangles.transition().duration(100)
							.style('fill-opacity', function(d){
							if(self.start_date <= d && self.end_date > d){
								return .8;
							}
							else{ return .2; }
						});
					};
					if( pressed[0] == 1 && d < self.start_date.addDays(self.maxDays) ){
						self.setStartDate(d);
						handle.transition().duration(100)
							.attr('x', slideAxis(d.addDays(i)) - .15*sectionWidth + xOffset);
						update();
					} else if(pressed[1] == 1 && d.addDays(1) > self.start_date) {
						self.setEndDate(d.addDays(1));
						handle.transition().duration(100)
							.attr('x', slideAxis(d.addDays(1)) - .15*sectionWidth + xOffset);
						update();
					}
					
				});
			})
			d3.select(window).on('mouseup',function(d){
				pressed = [0,0];
				selectionRectangles.on('mouseover', null);
			});
	}
	
	getDrugNames(){
		var nameSet = new Set(['All']);
		this.data.forEach(function(d){
			nameSet.add(d.nonproprietaryname.split(' ')[0]);
		},nameSet);
		return Array.from(nameSet);
	}
	
	setColor(colorString){
		this.baseColor = colorString;
		var node = this.svg.selectAll('rect.timeRectangle')
			.attr('fill', colorString);
	}
	
	setDrug(drugName, start_date = null){
		this.drugName = drugName;
		if(drugName == 'All'){
			this.drugName = null;
		}
		this.runFilters();
	}
	
	setMaxDays(maxDays){
		this.maxDays = maxDays;
		this.runFilters();
	}
	
	setEndDate(endDate){
		endDate = new Date(endDate);
		this.maxDays = d3.timeDay.count(this.start_date, endDate);
		this.runFilters();
	}
	
	setStartDate(start_date){
		this.start_date_filter = new Date(start_date);
		this.maxDays += d3.timeDay.count( this.start_date_filter, this.start_date );
		this.runFilters();
	}
}

