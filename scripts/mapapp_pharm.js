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
//             
        }

        render();

        mapP.on("viewreset", function(){
            render();
        })
        mapP.on("move", function(){
            render();
        })

    
//     

    })