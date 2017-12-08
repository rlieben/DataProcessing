	
	// filters data for key(province), is used later
	function filterJSON(json, key, value) {
  		var result = [];
	  json.forEach(function(val,idx,arr){
	    if(val[key] == value){
	    
	      result.push(val)
	    }
	  })
	  return result;
	}

	// set width and height
	var width = 960,
		height = 550;

	// date transform
	var format = d3.time.format("%Y-%m-%d").parse;

	// colour scheme for provinces
	var colour = d3.scale.category20();


	var projection = d3.geo.mercator()
		.scale(1)
		.translate([0, 0]);

	var path = d3.geo.path()
		.projection(projection);

	var svg = d3.select("body").append("svg")
		.attr("width", width)
		.attr("height", height);

	// appending name to svg element
	svg.append("text")
		.attr("x", 0)             
		.attr("y", 20)
		.attr("text-anchor", "left")  
		.style("font-size", "12px")
		.text("Name: Raoul Lieben ");

	// appending title to svg element
	svg.append("text")
		.attr("x", (width / 4))             
		.attr("y", 20)
		.attr("text-anchor", "middle")  
		.style("font-size", "12px") 
		.style("text-decoration", "underline")  
		.text("Average temperature per province of the Netherlands");

	// creating graph element
	var graph = d3.select('body').append("svg")
		svg.append("rect")
		.attr("class", "background")
		.attr("width", width / 2)
		.attr("height", height)
		.attr('x', width / 2);

	// appending title to svg element
	graph.append("text")
		.attr("x", (width / 2))             
		.attr("y", height)
		.attr("text-anchor", "middle")  
		.style("font-size", "12px") 
		.style("text-decoration", "underline")  
		.text("Average humidity in Maastricht and de Bilt with max and min range");

	// set x and y axis
	var x = d3.scale.ordinal().rangeRoundBands([0, width], 1),
		y = d3.scale.linear().rangeRound([height, 0]);

	// Define the axes
	var xAxis = d3.svg.axis().scale(x)
	    .orient("bottom").ticks(5)
	    .tickFormat(d3.time.format("%Y"))
	// // creating x axis
	// var xAxis = d3.svg.axis()
	//     .scale(x)
	//     .orient("bottom");

// creating y axis
	var yAxis = d3.svg.axis()
	    .scale(y)
	    .orient("left")
	    .ticks(10, "celsius");

	// Define the line
	var provinceline = d3.svg.line()
		.interpolate("cardinal")
	    .x(function(d) { return x(d.date); })
	    .y(function(d) { return y(d.gemhum); });

// create queue
	queue()
		.defer(d3.json, 'nld.json')
		.defer(d3.json, 'jsonified.json')
		.await(generateMap);

	// generate map
	function generateMap(error, nld, jsonified){

		// errorcheck
		if (error) throw error;

		// creating map
		var l = topojson.feature(nld, nld.objects.subunits).features[3],
			b = path.bounds(l),
			s = .2 / Math.max((b[1][0] - b[0][0]) / width, (b[1][1] - b[0][1]) / height),
			t = [(width - s * (b[1][0] + 2 * b[1][0])) / 2, (height - s * (b[1][1] + b[0][1])) / 2];

		projection
			.scale(s)
			.translate(t);

		svg.append("g")
				.attr("class", "provinces")
			.selectAll("path")
				.data(topojson.feature(nld, nld.objects.subunits).features).enter()
				.append("path")
				.attr("d", path)
				.attr("fill", function(d, i) {
					return colour(i);
				})
				.attr("class", function(d, i) {
					return d.properties.name;
				});

		// hover element
		let hoverEnabled = false;
			svg.on('mousedown', x => hoverEnabled = true)
				.on('mouseup', x => hoverEnabled = false)
			svg.selectAll('.provinces path').on('mouseover', function() {
				if (hoverEnabled) {
					this.class.list.add('hovered')
					
				} 
		
		svg.append("path")
			.attr("class", "provinceborders")
			.attr("d", path(topojson.mesh(nld, nld.objects.subunits, function(a, b) { return a !== b; })))
		
		// extract province name
		svg.selectAll('.provinces path').on('mouseover', function(d) {
			provincename = d.properties.name
			console.log(provincename)

			// filter data on name
			var data = filterJSON(jsonified, 'province', provincename);
	      
		    data.forEach(function(d) {
    			d.date = +d.date;
    			d.gemhum = +d.gemhum;
    		});

    		updateGraph(data)

		})
		})
}

// update graph function does not work yet.
function updateGraph(data) {
    

    // scale the range of the data
    x.domain(d3.extent(data, function(d) { return d.date; }));
    y.domain([0, d3.max(data, function(d) { return d.gemhum; })]);

	
 	var province = svg.selectAll(".line")
      	.data(result, function(d){return d.gemhum});

	province.enter().append("path")
		.attr("class", "line");

	province.transition()
		.style("stroke", function(d,i) { return d.color = color(d.province); })
		.attr("id", function(d){ return 'tag'+d.province.replace(/\s+/g, '');}) // assign ID
		.attr("d", function(d){
		
				return provinceline(d.gemhum)
			});

		province.exit().remove();
		
		var legend = d3.select("#legend")
			.selectAll("text")
			.data(dataNest, function(d){return d.province});

		//checkboxes
		legend.enter().append("rect")
		  .attr("width", 10)
		  .attr("height", 10)
		  .attr("x", 0)
		  .attr("y", function (d, i) { return 0 +i*15; })  // spacing
		  .attr("fill",function(d) { 
		    return color(d.province);
		    
		  })
		  .attr("class", function(d,i){return "legendcheckbox " + d.province})
			.on("click", function(d){
			  d.active = !d.active;
			  
			  d3.select(this).attr("fill", function(d){
			    if(d3.select(this).attr("fill")  == "#ccc"){
			      return color(d.province);
			    }else {
			      return "#ccc";
			    }
			  })
			  
			  
			 var result = dataNest.filter(function(val,idx, arr){
         return $("." + val.province).attr("fill") != "#ccc" 
       // matching the data with selector status
      })
      
       // Hide or show the lines based on the ID
       graph.selectAll(".line").data(result, function(d){return d.province})
         .enter()
         .append("path")
         .attr("class", "line")
         .style("stroke", function(d,i) { return d.color = color(d.province); })
        .attr("d", function(d){
                return provinceline(d.gemhum);
         });
 
      graph.selectAll(".line").data(result, function(d){return d.province}).exit().remove()  
					
			})
		        
    // Add the Legend text
    legend.enter().append("text")
      .attr("x", 15)
      .attr("y", function(d,i){return 10 +i*15;})
      .attr("class", "legend");

		legend.transition()
      .style("fill", "#777" )
      .text(function(d){return d.province;});

		legend.exit().remove();

		graph.selectAll(".axis").remove();

    // Add the X Axis
    graph.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    // Add the Y Axis
    graph.append("g")
        .attr("class", "y axis")
        .call(yAxis);
};

function clearAll(){
  d3.selectAll(".line")
	.transition().duration(100)
			.attr("d", function(d){
        return null;
      });
  d3.select("#legend").selectAll("rect")
  .transition().duration(100)
      .attr("fill", "#ccc");
};

function showAll(){
  d3.selectAll(".line")
	.transition().duration(100)
			.attr("d", function(d){
        return provinceline(d.gemhum);
      });
  d3.select("#legend").selectAll("rect")
  .attr("fill",function(d) {
    if (d.active == true){
       return color(d.province);
     }
   })
};

	
