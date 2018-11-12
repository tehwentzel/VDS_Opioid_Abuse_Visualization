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
		this.start_date_filter = start_date_filter
		if(start_date_filter != null){
			this.start_date = new Date(start_date_filter);
		} else{ this.start_date = null }
		this.drugName = null;
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
		//this.data = this.allData;
		//console.log(this.data);
		
		this.runFilters();
		// this.end_date = d3.max(this.data, 
			// function(d){return d.final_date;});	
		// if( d3.timeDay.count( this.start_date, this.end_date ) > this.maxDays ){
			// this.end_date = new Date(this.filldate).addDays( this.maxDays );
		// }
		//this.drawSvg();
		//this.drawRects();
	}
	
	runFilters(){
		if( this.drugName != null ){
			this.data = this.allData.filter(d => 
				this.drugName.localeCompare( d.nonproprietaryname.split(" ")[0], {sensitivity: 'base'} ) == 1
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
		this.data = this.data.filter(d => d.filldate < this.end_date);
		this.data.forEach(function(d){
			d.cutoff_date = d.final_date;
			if(d.final_date > this.end_date){
				d.cutoff_date = this.end_date;
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
			d.startPos = this.xAxis(d.filldate) + .051*this.width;
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
		d3.selectAll('.visit').on("mouseover", function(){
			d3.select(this).select('.fillperiod')
				.attr('style', 'stroke-width:2;stroke:blue;stroke-opacity:1')
		}).on("mouseout", function(){
			d3.select(this).select('.fillperiod')
				.attr('style', 'stroke-width:2;stroke:blue;stroke-opacity:0')
		});
	}
	
	setColor(colorString){
		this.baseColor = colorString;
		var node = this.svg.selectAll('rect.timeRectangle')
			.attr('fill', colorString);
	}
	
	setDrug(drugName, start_date = null){
		this.drugName = drugName;
		this.runFilters();
	}
	
	setMaxDays(maxDays){
		this.maxDays = maxDays;
		this.runFilters();
	}
	
	setStartDate(start_date){
		this.start_date_filter = new Date(start_date);
		this.runFilters();
	}
}

