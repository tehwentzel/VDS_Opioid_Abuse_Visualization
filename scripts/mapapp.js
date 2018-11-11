    L.mapbox.accessToken = 'pk.eyJ1IjoiYW5haWszIiwiYSI6ImNqbWNkNTZ0bDBlM2Izb3M0MWQzNHZtYzEifQ.fLozOxjrg08I3StfKz0AhA'
    var map = L.mapbox.map('map', 'mapbox.dark', {maxZoom: 18, minZoom: 0})
    .setView([41.77, -87.62], 10);

    function project(latlng){
        // var array = [+latlng.lat, +latlng.lon];
        // console.log(array);
        // console.log(L.latLng(latlng));
        var point = map.latLngToLayerPoint(L.latLng(latlng));
        // console.log(point);
        return point;
    }

      var svgPatient = d3.select(map.getPanes().overlayPane)
    .append("svg");

    console
    var g = svgPatient.append("g").attr("class", "leaflet-zoom-hide");



    d3.csv("data/5000_patients.csv",function(err, data){

        console.log("data: ", data);
       
//         

        var dots = svgPatient.selectAll("circle.dot").data(data)

//         // console.log(data[0]);
        dots.enter()
        .append("circle")

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
               class: 'circle2'              
            })
//           
        }

        render();

        map.on("viewreset", function(){
            render();
        })
        map.on("move", function(){
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