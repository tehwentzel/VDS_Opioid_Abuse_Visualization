var drawMap = function(data,target){ 
	L.mapbox.accessToken = 'pk.eyJ1IjoiYW5haWszIiwiYSI6ImNqbWNkNTZ0bDBlM2Izb3M0MWQzNHZtYzEifQ.fLozOxjrg08I3StfKz0AhA'
    var map = L.mapbox.map(target, 'mapbox.dark', {maxZoom: 18, minZoom: 0})
    .setView([41.77, -87.62], 10);

    function project(latlng){
        // var array = [+latlng.lat, +latlng.lon];
        // console.log(array);
        // console.log(L.latLng(latlng));
        var point = map.latLngToLayerPoint(L.latLng(latlng));
        return point;
    }
	
	function findlatlng(lat,lng){
			// console.log(lat);
			let coord = {};
			coord["lat"] = lat;
			coord["lng"] = lng;
			return coord;
	}

      var svgPatient = d3.select(map.getPanes().overlayPane)
    .append("svg");

    var g = svgPatient.append("g").attr("class", "leaflet-zoom-hide");

	console.log("data: ", data);

	// var hoverdiv;
	// if(target="maps"){
	var hoverdiv = d3.select("body").append("div")   
        .attr("class", "tooltippatient")               
        .style("opacity", 0);
    // }
    //    else{
    //    	var hoverdiv = d3.select("body").append("div")   
    //     .attr("class", "tooltippharmacy")               
    //     .style("opacity", 0);

    //    }
   
//         

	var dots = svgPatient.selectAll("circle.dot")
		.data(data)
		.enter()
		.append('circle');
	var formatDots = g => g.attr('class','dot')
		.attr('cx', function(d){ return project(findlatlng(d.x,d.y)).x})
		.attr('cy', function(d){ return project(findlatlng(d.x,d.y)).y})
		.attr('r','4')
		.attr('stroke', '2px white')
		.attr('fill', 'red')
		.attr('opacity', 1);
	dots.call(formatDots);

	function tooltip(d){
		var stringvalue;
		if(target=="map"){
			 stringvalue = "OverFlow Index:" + d.overflow_idx;
			 return stringvalue;
		}
			else{
				stringvalue = "Patient Count:" + d.patient_count;
				return stringvalue;
			}
	}

	function render(){
		var bounds = map.getBounds();
		var topLeft = map.latLngToLayerPoint(bounds.getNorthWest())
		var bottomRight = map.latLngToLayerPoint(bounds.getSouthEast())
		// console.log(bounds, topLeft, bottomRight)
		svgPatient.style("width", map.getSize().x + "px")
		.style("height", map.getSize().y + "px")
		.style("left", topLeft.x + "px")
		.style("top", topLeft.y + "px");
		g.attr("transform", "translate(" + -topLeft.x + "," + -topLeft.y + ")");
		dots.call(formatDots);
		dots.attr("transform", "translate(" + -topLeft.x + "," + -topLeft.y + ")")
		.on("mouseover", function(d){   
                      d3.select(this).classed('active', true)
                      hoverdiv.transition()      
                .duration(200)      
                .style("opacity", .9)
                hoverdiv.html(tooltip(d))
                .style("left", (d3.event.pageX) + "px")     
                .style("top", (d3.event.pageY) + "px");
                //  .style("left","50px")     
                // .style("top","50px");
            });
//           
	}

	render();

	map.on("viewreset", function(){
		render();
	})
	map.on("move", function(){
		render();
	})
	return dots;
}