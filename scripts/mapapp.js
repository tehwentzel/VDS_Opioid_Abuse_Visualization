
var getMap = function(target, colorFunction){ 
	// console.log(map);
	L.mapbox.accessToken = 'pk.eyJ1IjoiYW5haWszIiwiYSI6ImNqbWNkNTZ0bDBlM2Izb3M0MWQzNHZtYzEifQ.fLozOxjrg08I3StfKz0AhA'
    var map = L.mapbox.map(target, 'mapbox.dark', {maxZoom: 12, minZoom: 9}, {attributionControl: false})
		.setView([41.77, -87.62], 10);
    
	var drawMap = function(data, presdata, target, indi_pat, selectedId){

		function project(latlng){
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

		function findlatlngpath(lat,lng){
				// console.log(lat);
				let coord = {};
				coord["lat"] = lat;
				coord["lng"] = lng;
				return coord;
		}

		var filteredData;
		d3.selectAll(map.getPanes().overlayPane).remove();
		var svgPatient = d3.select(map.getPanes().overlayPane).append("svg");
		
		var g = svgPatient.append("g").attr("class", "leaflet-zoom-hide");
		
		var hoverdiv = d3.select("body").append("div")   
			.attr("class", "tooltippatient")               
			.style("opacity", .9)
			.style('visibility', 'hidden');

		var aggrepharmacy_pat = d3.nest()
		  .key(function(d) { return d.pat_id;})
		  .key(function(d) { return d.pharmacynpi;})
		  // .key(function(d) { return d.pat_id;})
		  .rollup(function(v) { return ( function(d) { return d.key.values; }); })
		  .entries(presdata);

		  var aggrepharmacy_doc = d3.nest()
		  .key(function(d) { return d.physiciannpi;})
		  .key(function(d) { return d.pharmacynpi;})
		  // .key(function(d) { return d.pat_id;})
		  .rollup(function(v) { return ( function(d) { return d.key.values; }); })
		  .entries(presdata);  
		  // console.log("doc data", aggrepharmacy_doc);

		function findAllPharmacyIds(id){
			if(id == 0){ return new Array(); }
			
			var pharmIds = [];
			if(indi_pat){

				for(i in aggrepharmacy_pat){
					if(aggrepharmacy_pat[i].key == id){
						for(j in aggrepharmacy_pat[i].values){
							pharmIds[j] = aggrepharmacy_pat[i].values[j].key;
						}
						//console.log(pharmIds);
						return pharmIds;
					} 
				}
			} 
			else{
			 	for(i in aggrepharmacy_doc){
					if(aggrepharmacy_doc[i].key == id){
						for(j in aggrepharmacy_doc[i].values){
							pharmIds[j] = aggrepharmacy_doc[i].values[j].key;
						}
						//console.log(pharmIds);
						return pharmIds;
			 		} 
				}
			}
		}

		 if(target=="paths"||target=="paths2"){
		 	d3.selectAll(".pathDot").remove();
			filteredData = data.filter(function(d) { return findAllPharmacyIds(selectedId).includes(d.pharmacynpi);});
			var bounds = [];
			filteredData.forEach(function(d){
				bounds.push(findlatlng(d.x,d.y));
			});
			var dots = g.selectAll("circle.pathDot")
				.data(filteredData)//, function(d) {return d.x/d.y;})
				.enter()
				.append('circle')
				.attr('class','pathDot');
			map.fitBounds(bounds);
			dots.exit().remove();
		}
		else{
			var dots = g.selectAll("circle.dot")
				.data(data)//, function(d) {return d.x/d.y;})
				.enter()
				.append('circle')
				.attr('class','dot');
		}

	
		var formatDots = g => 
			// .filter(function(d) { return d.pharmacynpi == "787411294" })
			g.attr('cx', function(d){ return project(findlatlng(d.x,d.y)).x;})
			.attr('cy', function(d){ return project(findlatlng(d.x,d.y)).y;})
			.attr('r','4')
			.attr('stroke', '2px white')
			.attr("fill", function (d) {  return getcolor(d);})
			.attr('opacity', 0.8);
		dots.call(formatDots);
	

		function tooltip(d){
			var stringvalue;
			if(target=="patient" && indi_pat == true){
				 stringvalue = "Patient ID:&nbsp" + d.pat_id + "</br>" + "OverFlow Index:" + d.overflow_idx;
				 return stringvalue;
			}
			else if(target=="patient"){
				 stringvalue = "Doctor ID:&nbsp" + d.physiciannpi + "</br>" + "Patient Count:" + d.patient_count;
				 return stringvalue;
			}

			else{
				stringvalue = "Pharmacy ID:&nbsp" + d.pharmacynpi + "</br>" + "Patient Count:" + d.patient_count;
				return stringvalue;
			}
		}

		function getcolor(d){
			if(target == "patient"){
				if(indi_pat){
					return colorFunction(d.overflow_idx, "patient");
				}else{
					return colorFunction(d.patient_count, "doctor");
				}
			} else{
				return colorFunction(d.patient_count, "pharmacy");
			}
			// if(target=="patient" && indi_pat == true){

				// var cy = 100 - ((d.overflow_idx - 1)*100)* 5;
				 // return "hsl(0, 100%," + cy + "%)" ;
			// }
			// else if(target=="patient"){

				// var cy = 100 - (d.patient_count)/4;
				 // return "hsl(100, 100%," + cy + "%)" ;
			// }
			// else{
				// var cz = 100 - (d.patient_count)/3;
				 // return "hsl(242,100%," + cz + "%)" ;
			// }
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
			var translate = item => item.attr("transform", "translate(" + (-topLeft.x) + "," + (-topLeft.y) + ")");
			g.call(translate);
			//dots.call(translate);
			dots.call(formatDots);
			dots.on("mouseover", function(d){   
						  d3.select(this).classed('active', true)
						  hoverdiv.transition()      
					.duration(20)      
					.style("visibility", 'visible')
					hoverdiv.html(tooltip(d))
					.style("left", (d3.event.pageX) + "px")     
					.style("top", (d3.event.pageY) + "px");
					//  .style("left","50px")     
					// .style("top","50px");
				})
			.on("mouseout", function(d){
						  d3.select(this).classed('active', false)
						  hoverdiv.transition()      
					.duration(50)      
					.style("visibility", 'hidden');   
					  });


			var pathdiv = d3.select("body").append("div")   
			.attr("class", "path")               
			.style("opacity", 0);

			var pathLine = d3.svg.line()
				.interpolate("linear-open")
				.x(function(d) { return project(findlatlngpath(d.x,d.y)).x - topLeft.x; })
				.y(function(d) { return project(findlatlngpath(d.x,d.y)).y - topLeft.y; });

			if(target=="paths"||target=="paths2"){
				d3.selectAll("path").remove();
				 var path = svgPatient.append("path")
					.attr("d",pathLine(filteredData))
					.attr("class", "path")
					.attr("stroke", "orange")
				      .attr("stroke-width", "2")
				      .attr("fill", "none");

  				  var totalLength = path.node().getTotalLength();

			    path
			      .attr("stroke-dasharray", totalLength + " " + totalLength)
			      .attr("stroke-dashoffset", totalLength)
			      .transition()
			        .duration(500*filteredData.length)
			        .attr("stroke-dashoffset", 0);
			}

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
	return drawMap;
}