/*
Minor programming, University of Amsterdam
Dataprocessing
10556346
Raoul Lieben
*/
window.onload = function(){

	// filters data for key(province), is used later
	function filterJSON(json, key, value) {

	var result = [];
	json.forEach(function(val,idx,arr){
		if(val[key] == value){

		result.push(val)
	}
	})
	// console.log(result)
	return result;
	}

	// set width and height
	var margin = {left: 200, right: 100, top: 50, bottom: 200},
	mapwidth = 960 - margin.left - margin.right,
	mapheight = 550 - margin.top - margin.bottom,
	graphwidth = 750 - margin.left - margin.right,
	graphheight = 450 - margin.top - margin.bottom;


	// date transform
	var format = d3.time.format("%Y%m%d").parse;

	// colour scheme for provinces
	var colour = d3.scale.category20();


	var projection = d3.geo.mercator()
	.scale(1)
	.translate([0, 0]);

	var path = d3.geo.path()
	.projection(projection);

	var svg = d3.select("body").append("svg")
	.attr("width", mapwidth - margin.right -  50)
	.attr("height", mapheight + margin.top);

	// appending title to svg element
	svg.append("text")
	.attr("x", (mapwidth / 2 - margin.right))             
	.attr("y", 10)
	.attr("text-anchor", "middle")  
	.style("font-size", "12px") 
	.style("text-decoration", "underline")  
	.style('fill', 'black')
	.text("Average temperature per province of the Netherlands");

	// creating graph element
	var graph = d3.select('body').append("svg")
	.attr("width", graphwidth + margin.left)
	.attr("height", graphheight + margin.top + margin.bottom)
	.append("g")	
		.attr("transform", "translate(" + 50 + "," + margin.top + ")");

	// set x and y axis
	var x = d3.scale.ordinal().rangeRoundBands([0, graphwidth], 1),
	y = d3.scale.linear().range([graphheight , 0]);

	// Define the axes
	var xAxis = d3.svg.axis()
	.scale(x)
	.orient("bottom")
	.ticks(5);

	// creating y axis
	var yAxis = d3.svg.axis()
	.scale(y)
	.orient("left")
	.ticks(5);

	// creating tip on bar
	var tipmap = d3.tip()
	.attr('class', 'd3-tip')
	.offset([-10, 0])
	.html(function(d) {
		return "<strong>Province:</strong> <span style='color:red'>" + d.properties.name + "</span>";
	});

	svg.call(tipmap);

	// create queue
	queue()
	.defer(d3.json, 'nld.json')
	// .defer(d3.json, 'inwoneraantal.json')
	.defer(d3.json, 'jsonified.json')
	.await(generateMap);

	// generate map
	function generateMap(error, nld, jsonified){

		// errorcheck
		if (error) throw error;

		// creating map
		var l = topojson.feature(nld, nld.objects.subunits).features[3],
			b = path.bounds(l),
			s = .2 / Math.max((b[1][0] - b[0][0]) / mapwidth, (b[1][1] - b[0][1]) / mapheight),
			t = [(mapwidth - s * (b[1][0] + 2 * b[1][0])) / 2, (mapheight - s * (b[1][1] + b[0][1])) / 2];

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

		jsonified.forEach(function(d) {
				d.date = format(d.date.toString());
				d.gemhum = +d.gemhum;
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

		svg.selectAll('.provinces path')
			.on('mouseover', tipmap.show)
			.on('mouseout', tipmap.hide);

		// extract province name
		svg.selectAll('.provinces path').on('click', function(d) {
			
			
			provincename = d.properties.name

			console.log(provincename)
			// filter data on name
			var data = filterJSON(jsonified, 'province', provincename);
		  

			console.log(data)

			// remove previous line of graph
			graph.selectAll('path').remove();
			

			updateGraph(data, jsonified)

		});
		});
	};


	// update graph function
	function updateGraph(data, jsonified) {


	// scale the range of the data on whole dataset
	x.domain(jsonified.map(function(d) { return d.date; }));
	y.domain([0, d3.max(jsonified, function(d) { return d.gemhum; })]);


	console.log(data)

	// remove all previous text
	graph.selectAll("text").remove()

	// append x-axis values to chart
	graph.append("g")
			.attr("class", "x axis")
		.attr("transform", "translate(0," + graphheight + ")")
		.call(xAxis)
		.selectAll("text")  
			.style("text-anchor", "end")
			.attr("dx", "-.15em")
			.attr("dy", ".25em")
			.attr("transform", "rotate(-65)");

	// append y-axis values to chart
	graph.append("g")
			.attr("class", "y axis")
			.call(yAxis)
		.append("text")
			.attr("transform", "rotate(-90)")
			.attr("y", 6)
			.attr("dy", ".71em")
			.style("text-anchor", "end")
			.text("Temperature * 10 (C)");


	// appending title to graph element
	graph.append("g").append("text")
		.attr("x", (graphwidth / 2))             
		.attr("y",  - margin.top / 2)
		.attr("text-anchor", "middle")  
		.style("font-size", "12px")
		.style("text-decoration", "underline")
		.style('fill', 'black')
		.text("Average temp in " + data[0]['province'] + " in November 2017");

	// create line for average
	var line = d3.svg.line()
		.x(function(d) { return x(d.date); })
		.y(function(d) { return y(d.gemhum); });

	// append line to graph
	graph.append("g").append("path")
		.datum(data)
		.attr("fill", "none")
		.attr("stroke", "steelblue")
		.attr("stroke-linejoin", "round")
		.attr("stroke-linecap", "round")
		.attr("stroke-width", 1.5)
		.attr("d", line);

	};
};
