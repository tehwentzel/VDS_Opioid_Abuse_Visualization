/*var App = App || {};
class NetworkGraph{
    
    constructor(pat_id, NODE_GRAPH){
		this.NODE_GRAPH = NODE_GRAPH;
		this.height = 140;
		this.baseColor = '#2ca25f';
		this.div = d3.select("#network")
			.append('div')
			.attr('class','tooltip')
			.style('opacity', 0);
		this.svg = d3.select("#gantt-chart")
			.append('svg')
			.attr('width','90%')
			.attr('height', this.height + 'px');
		this.width = this.svg.node().clientWidth;
        this.struct=this.createStruct(pat_id,NODE_GRAPH);
        console.log(this.struct);
        finalGraph(this.struct);
    }
    
    createStruct(selected_id,NODE_GRAPH)
    {
        var struct={};
        struct.nodes=[];
        struct.links=[];
        struct.nodes.push({"id":selected_id,"group":"patient"});
        NODE_GRAPH.forEach(function(d){
            
            if (d.pat_id==selected_id)
            {
                let doctor_node = {"id":d.physiciannpi,"group":"doctor"};
                let pharmacy_node={"id":d.pharmacynpi,"group":"pharmacy"};
                struct.nodes.push(doctor_node);
                struct.nodes.push(pharmacy_node);
                let doctor_link={"source":selected_id,"target":d.physiciannpi}
                let pharmacy_link={"source":selected_id,"target":d.pharmacynpi}
                struct.links.push(doctor_link);
                struct.links.push(pharmacy_link);
            }
       
        })
        return struct;
        
    }
    finalGraph(struct)
    {
        this.width = 960,
            height = 500
this.svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);
var force = d3.layout.force()
    .gravity(.05)
    .distance(100)
    .charge(-100)
    .size([width, height]);
d3.json("graphFile.json", function(json) {
  force
      .nodes(json.nodes)
      .links(json.links)
      .start();
  var link = svg.selectAll(".link")
      .data(json.links)
    .enter().append("line")
      .attr("class", "link")
    .style("stroke-width", function(d) { return Math.sqrt(d.weight); });
  var node = svg.selectAll(".node")
      .data(json.nodes)
    .enter().append("g")
      .attr("class", "node")
      .call(force.drag);
  node.append("circle")
      .attr("r","5");
  node.append("text")
      .attr("dx", 12)
      .attr("dy", ".35em")
      .text(function(d) { return d.name });
  force.on("tick", function() {
    link.attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });
    node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
  });
});
    }
    
}*/
function createStruct(selected_id,NODE_GRAPH)
    {
        var struct={};
        struct.nodes=[];
        struct.links=[];
        struct.nodes.push({"id":selected_id,"group":"patient"});
        NODE_GRAPH.forEach(function(d){
            
            if (d.pat_id==selected_id)
            {
                doctor_node = {"id":d.physiciannpi,"group":"doctor"};
                pharmacy_node={"id":d.pharmacynpi,"group":"pharmacy"};
                struct.nodes.push(doctor_node);
                struct.nodes.push(pharmacy_node);
                doctor_link={"source":selected_id,"target":d.physiciannpi}
                pharmacy_link={"source":selected_id,"target":d.pharmacynpi}
                struct.links.push(doctor_link);
                struct.links.push(pharmacy_link);
            }
       
        })
        console.log(struct)
        return struct;
        
    }
function tryS(struct){

var svg = d3.select("#network").append("svg")
.attr("width",900)
.attr("height",600)
width = +svg.attr("width"),
height = +svg.attr("height");

var simulation = d3.forceSimulation()
.force("link", d3.forceLink().id(function(d) { return d.id; }))
//.force("charge", d3.forceManyBody().strength(-200))
    .force('charge', d3.forceManyBody()
  .strength(-200)
  .theta(0.8)
  .distanceMax(150)
)
// 		.force('collide', d3.forceCollide()
//       .radius(d => 40)
//       .iterations(2)
//     )
.force("center", d3.forceCenter(width / 2, height / 2));


var graph = {
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
      .call(d3.drag()
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended));

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
     .attr("r", 16)
     .style("fill", "#efefef")
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

run(graph)
}