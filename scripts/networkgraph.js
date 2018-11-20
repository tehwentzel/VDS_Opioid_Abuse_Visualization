function createStruct(selected_id,NODE_GRAPH)
    {
    var struct={};
    struct.nodes=[];
    struct.links=[];
    struct.nodes.push({"id":selected_id,"group":"patient"});
    NODE_GRAPH.forEach(function(d)
        {
        if (d.pat_id==selected_id)
            {
            if(d.pharisphy==1)
                {
                var hasMatchPHY=false;
                var hasMatchPHA=false;
                for(var index=1;index<struct.nodes.length;++index)
                    {
                    var animal=struct.nodes[index]
                    
                    if(animal.id==d.physiciannpi){hasMatchPHY=true;}
                    if(animal.id==d.pharmacynpi){hasMatchPHA=true;}
                    }
                if(hasMatchPHY==false){
                    hospital_node = {"id":d.physiciannpi,"group":"hospital"};
                    struct.nodes.push(hospital_node);
                    hospital_link={"source":selected_id,"target":d.physiciannpi}
                    struct.links.push(hospital_link);
                }
                }
            else{
                var hasMatchPHY=false;
                var hasMatchPHA=false;
                for(var index=1;index<struct.nodes.length;++index)
                    {
                    var animal=struct.nodes[index]
                    
                    if(animal.id==d.physiciannpi){hasMatchPHY=true;}
                    if(animal.id==d.pharmacynpi){hasMatchPHA=true;}
                    }
                if(hasMatchPHY==false)
                    {
                    doctor_node = {"id":d.physiciannpi,"group":"doctor"};
                    struct.nodes.push(doctor_node);
                    doctor_link={"source":selected_id,"target":d.physiciannpi}
                    struct.links.push(doctor_link);
                    }
                if(hasMatchPHA==false)
                    {
                    pharmacy_node={"id":d.pharmacynpi,"group":"pharmacy"};
                    struct.nodes.push(pharmacy_node);
                    pharmacy_link={"source":selected_id,"target":d.pharmacynpi}
                    struct.links.push(pharmacy_link);
                    }
                }
            }
        })
        
       

    console.log(struct)
    return struct;  
}

function tryS(struct)
    {
    var net=d3.select("#network")
    if(net.select("#mygraphsvg")!=null)
        {
        net.selectAll("#mygraphsvg").remove();
        }
    var svg = d3.select("#network").append("svg")
        .attr("width",400)
        .attr("height",200)
        .attr("id","mygraphsvg")
        .classed("svg-container",true)
        width = +svg.attr("width"),
        height = +svg.attr("height");

    var simulation = d3.forceSimulation()
        .force("link", d3.forceLink().id(function(d) { return d.id; }))
        //.force("charge", d3.forceManyBody().strength(-200))
            .force('charge', d3.forceManyBody()
        .strength(-800)
        .theta(1.2)
        .distanceMax(400)
        )
        // 		.force('collide', d3.forceCollide()
        //       .radius(d => 40)
        //       .iterations(2)
        //     )
        .force("center", d3.forceCenter(width / 4, height / 4));


    var graph = 
    {
    "nodes": [
    {"id": "1", "group": 1},
    {"id": "2", "group": 2},
    {"id": "4", "group": 3},
    {"id": "8", "group": 4},
    {"id": "16", "group": 5},
    {"id": "11", "group": 1},
    {"id": "12", "group": 2},
    {"id": "14", "group": 3},
    {"id": "18", "group": 4},
    {"id": "116", "group": 5}
    ],
    "links": [
    {"source": "1", "target": "2", "value": 1},
    {"source": "2", "target": "4", "value": 1},
    {"source": "4", "target": "8", "value": 1},
    {"source": "4", "target": "8", "value": 1},
    {"source": "8", "target": "16", "value": 1},
    {"source": "16", "target": "1", "value": 1}
    ]
    }

    graph=struct;

    function run(graph) {

        graph.links.forEach(function(d){
        //     d.source = d.source_id;    
        //     d.target = d.target_id;
        });           

        var div = d3.select("body").append("div")	
            .attr("class", "tooltippatient")				
            .style("opacity", 0);


        var link = svg.append("g")
                    .style("stroke", "#aaa")
                    .selectAll("line")
                    .data(graph.links)
                    .enter().append("line");

        var node = svg.append("g")
                .attr("class", "nodes")
                .selectAll("circle")
                .data(graph.nodes)
                .enter().append("circle")
                .attr("r", 2)
                .on("click",clicked)
                .call(d3.drag()
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended))
                .on("mouseover", function(d) {		
                    div.transition()		
                        .duration(200)		
                        .style("opacity", .9);		
                    div	.html(d.group + "<br/>"  + d.id)	
                        .style("left", (d3.event.pageX) + "px")		
                        .style("top", (d3.event.pageY - 28) + "px");	
                    })					
                .on("mouseout", function(d) {		
                    div.transition()		
                        .duration(500)		
                        .style("opacity", 0);	
                });

        var label = svg.append("g")
        .attr("class", "labels")
        .selectAll("text")
        .data(graph.nodes)
        .enter().append("text")
            .attr("class", "label")
            .text(function(d) { return d.id; });

        simulation
        .nodes(graph.nodes)
        .on("tick", ticked);

        simulation.force("link")
        .links(graph.links);

        function ticked() {
        link
            .attr("x1", function(d) { return d.source.x; })
            .attr("y1", function(d) { return d.source.y; })
            .attr("x2", function(d) { return d.target.x; })
            .attr("y2", function(d) { return d.target.y; });

        node
            .attr("r", 10)
            .style("fill", function(d){
                if(d.group=="patient") 
                    return "#FF6600";
                if(d.group=="pharmacy")
                    return "#1ECAEC";
                if(d.group=="doctor")
                    return "green"
                else{
                    return "#FFFF33";
                }})
            .style("stroke", "#424242")
            .style("stroke-width", "1px")
            .attr("cx", function (d) { return d.x+5; })
            .attr("cy", function(d) { return d.y-3; });

        label
            .attr("x", function(d) { return d.x; })
            .attr("y", function (d) { return d.y; })
            .style("font-size", "10px").style("fill", "#333");
        }
    }

    function dragstarted(d) {
    if (!d3.event.active) simulation.alphaTarget(0.3).restart()
    d.fx = d.x
    d.fy = d.y
    //  simulation.fix(d);
    }

    function dragged(d) {
    d.fx = d3.event.x
    d.fy = d3.event.y
    //  simulation.fix(d, d3.event.x, d3.event.y);
    }

    function dragended(d) {
    d.fx = d3.event.x
    d.fy = d3.event.y
    if (!d3.event.active) simulation.alphaTarget(0);
    //simulation.unfix(d);
    }
    function clicked(d){
        console.log("heieie")
        console.log("done")
    }

    run(graph)
    }