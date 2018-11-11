    L.mapbox.accessToken = 'pk.eyJ1IjoiYW5haWszIiwiYSI6ImNqbWNkNTZ0bDBlM2Izb3M0MWQzNHZtYzEifQ.fLozOxjrg08I3StfKz0AhA'
    var mapP = L.mapbox.map('paths', 'mapbox.dark', {maxZoom: 18, minZoom: 0})
    .setView([41.77, -87.62], 10);

    function project(latlng){
        // var array = [+latlng.lat, +latlng.lon];
        // console.log(array);
        // console.log(L.latLng(latlng));
        var point = mapP.latLngToLayerPoint(L.latLng(latlng));
        // console.log(point);
        return point;
    }

      var svgP = d3.select(mapP.getPanes().overlayPane)
    .append("svg");

    var g = svgP.append("g").attr("class", "leaflet-zoom-hide");



    d3.csv("data/455_pharmacies.csv",function(err, data){

        console.log("data: ", data);
       
//         

        // var dots = g.selectAll("circle.dot").data(data)
        var dots = svgP.selectAll("circle.dot").data(data)

//         // console.log(data[0]);
        dots.enter()
        .append("circle")

        function render(){
            var bounds = mapP.getBounds();
            var topLeft = mapP.latLngToLayerPoint(bounds.getNorthWest())
            var bottomRight = mapP.latLngToLayerPoint(bounds.getSouthEast())
            // console.log(bounds, topLeft, bottomRight)
            svgP.style("width", mapP.getSize().x + "px")
            .style("height", mapP.getSize().y + "px")
            .style("left", topLeft.x + "px")
            .style("top", topLeft.y + "px");
            g.attr("transform", "translate(" + -topLeft.x + "," + -topLeft.y + ")");


                function findlatlng(lat,lng){
                    // console.log(lat);
                    let coord = {};
                    coord["lat"] = lat;
                    coord["lng"] = lng;
                    return coord;
                }
           
                dots.attr({
                cx: function(d){ return project(findlatlng(d.x,d.y)).x},
                cy: function (d){ return project(findlatlng(d.x,d.y)).y},
                r: "2",
                stroke: "3px red",
                fill: "blue" ,
                opacity: "0.4" ,
               // class: 'circle2'              
            })
//             .on("mouseover", function(d){   
//                       d3.select(this).classed('active', true)
//                       div.transition()      
//                 .duration(200)      
//                 .style("opacity", .9);      
//                 div .html("County: " + d.key + "<br/>" +"<br/>" + "No. of Deaths: " + d.values + "<br/>" + 
//                 "Female: " + (genderCount(d.key)).female +"<br/>"+ "Male: " + (genderCount(d.key)).male  )  
//                 // div .html(htmlinfo(d))
//                 .style("left", (d3.event.pageX) + "px")     
//                 .style("top", (d3.event.pageY - 100) + "px");
    

//                   })
//                 // .on("click", function(d){
//                 //     div.html(malefemalepng(d, (genderCount(d.key)).male, (genderCount(d.key)).female ))
//                 //     .style("left", (d3.event.pageX) + "px")     
//                 // .style("top", (d3.event.pageY + 100) + "px");   

//                 // })
                
//                    .on("mouseout", function(d){
//                       d3.select(this).classed('active', false)
//                       div.transition()      
//                 .duration(500)      
//                 .style("opacity", 0);   
//                   });
        }

        render();

        mapP.on("viewreset", function(){
            render();
        })
        mapP.on("move", function(){
            render();
        })

    
//     // }


//         var deathCount = d3.nest()
//         .key(function(d) { return d.gender; })
//         .rollup(function(leaves) { return leaves.length; })
//         .entries(data); 



//         var ageGroup = d3.nest()
//         .key(function(d) { return d.ageGroup; })
//         .rollup(function(leaves) { return leaves.length; })
//         .entries(data);

//     var html = "";
//         html    += "<table>";
//         html    += "  <tr class='dead'><td>Total Deaths</td><td class='data'>" + data.length + "</td></tr>";
//         html    += "  <tr><td>Total Number of Cities</td><td class='data'>" + cities.length + "</td></tr>";
//         html    += "  <tr><td>Total Number of States</td><td class='data'>" + states.length + "</td></tr>";
//         html    += "  <tr><td>Identified Number of Males</td><td class='data'>" + deathCount[1].values + "</td></tr>";
//         html    += "  <tr><td>Identified Number of Females</td><td class='data'>" + deathCount[0].values + "</td></tr>";
//         html    += "  <tr class='ageGroup'><td> Identified Age Groups:</td><td class='data'>" + "</td></tr>";
//         html    += "  <tr><td>Ages Under 13 : Child</td><td class='data'>" + ageGroup[1].values + "</td></tr>";
//         html    += "  <tr><td>Ages between 13 and 17 : Teen </td><td class='data'>" + ageGroup[2].values + "</td></tr>";
//         html    += "  <tr><td>Ages 18 and above : Adult </td><td class='data'>" + ageGroup[3].values + "</td></tr>";
//         html    += "</table>"
    
//     d3.select(".infoDiv").html(html)

//     console.log("newr",circRadius(1150));

//     console.log(aggreStateLat[0].values, aggreStateLng[0].values, circRadius(states[0].values));


//     function barOne(d){
//         return "d";
//     }

// var info = d3.select(".info").append("div")
// .attr("class", "info")
//     function malefemalepng(d, malecount, femalecount) {
//         // var html = "";
//         console.log("showInfo");
//         console.log(d);
//         // var malecount = genderCount(d.key).male;
//         // var femalecount = genderCount(d.key).female
//   var tHtml = d.key+",    Matched Death: "+d.values+",   Male: "+malecount;+",   Female: "+ femalecount;
//   var mHtml = "";
//   var fHtml = "";
//   for (i = 0; i < malecount; i++) { 
//     mHtml += '<img src="m24.png" width="2" height="3" alt="" />';
//     //imageM();
//   };
//   for (i = 0; i < femalecount; i++) { 
//     fHtml += '<img src="f16.png" width="2" height="3" alt="" />';
//     //imageM();
//   };
//   mHtml = "<div><span class='mnumber' style='color:#0698ff'>" +  malecount + "</span>" + mHtml + "</div>";
//   fHtml = "<div><span class='mnumber' style='color:#ff0677'>" +  femalecount + "</span>" + fHtml + "</div>";
//   // info.html(tHtml+mHtml + fHtml);
//   info.html(tHtml);
//   //info.style("display","block")
//   //.text(d.properties.City+', '+d.properties.State+"    Death Number: "+d.properties.NumberofDeaths+"M: "+d.properties.NumberofMale+"   F: "+d.properties.NumberofFemale+"    Average Age: "+d.properties.Age);

// }

    })