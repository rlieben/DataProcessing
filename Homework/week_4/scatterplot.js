/*
Minor programming
Raoul Lieben
10556346
*/

window.onload = function(){
	// defining dimensions of svg element
	var margin = {top: 50, right: 20, bottom: 40, left: 40},
		width = 960 - margin.left - margin.right,
		height = 500 - margin.top - margin.bottom;

	// creating x variable
	var x = d3.scale.linear()
		.range([0 , width]);

	// creating y variable
	var y = d3.scale.linear()
		.range([height, 0]);

	// creating color variable
	var color = d3.scale.category10();

	// creating x axis
	var xAxis = d3.svg.axis()
		.scale(x)
		.orient("bottom");

	// creating y axis
	var yAxis = d3.svg.axis()
		.scale(y)
		.orient("left");

	// creating svg element incl margins
	var svg = d3.select("body").append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
		.append("g")
			.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	// appending name to svg element
	svg.append("text")
	    .attr("x", 0)             
	    .attr("y", 0 - (margin.top / 2))
	    .attr("text-anchor", "left")  
	    .style("font-size", "12px")
	    .text("Name: Raoul Lieben ");

	// open json data file 
	d3.json("jsonified.json", function(error, data) {
		if (error) throw error;

		// 
		data.forEach(function(d) {
			d.population = +d.population;
			d.renenerg = +d.renenerg;
		});

		// setting x and y domains
		x.domain(d3.extent(data, function(d) { return d.population; })).nice();
		y.domain(d3.extent(data, function(d) { return d.renenerg; })).nice();

		// appending title to svg element
		svg.append("text")
	        .attr("x", (width / 2))             
	        .attr("y", 0 - (margin.top / 2))
	        .attr("text-anchor", "middle")  
	        .style("font-size", "12px") 
	        .style("text-decoration", "underline")  
	        .text("Renewable energy use of countries smaller than 100 million, compared to income class");

	    // appending data source to svg element
		svg.append("text")
	        .attr("x", 10)             
	        .attr("y", height + margin.bottom - 10)
	        .attr("text-anchor", "left")  
	        .style("font-size", "12px")  
	        .text("Source : https://data.worldbank.org/");

	    // appending x axis values to svg element
		svg.append("g")
	    	.attr("class", "x axis")
	    	.attr("transform", "translate(0," + height + ")")
	    	.call(xAxis)
			.append("text")
				.attr("class", "label")
				.attr("x", width)
				.attr("y", -6)
				.style("text-anchor", "end")
				.text("Total population number");

		// appending y axis values to svg element
		svg.append("g")
			.attr("class", "y axis")
			.call(yAxis)
			.append("text")
				.attr("class", "label")
				.attr("transform", "rotate(-90)")
				.attr("y", 6)
				.attr("dy", ".71em")
				.style("text-anchor", "end")
				.text("Renewable energy use(%)")

		// creating dots for data
		svg.selectAll(".dot")
			.data(data)
			.enter().append("circle")
				.attr("class", "dot")
				.attr("r", 3.5)
				.attr("cx", function(d) { return x(d.population); })
				.attr("cy", function(d) { return y(d.renenerg); })
				.style("fill", function(d) { return color(d.income); });

		// creating legend element
		var legend = svg.selectAll(".legend")
			.data(color.domain())
			.enter().append("g")
				.attr("class", "legend")
				.attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

		// appending rects for legend colors to legend
		legend.append("rect")
			.attr("x", width - 18)
			.attr("width", 18)
			.attr("height", 18)
			.style("fill", color);

		// appending text for legend values to legend
		legend.append("text")
			.attr("x", width - 24)
			.attr("y", 9)
			.attr("dy", ".35em")
			.style("text-anchor", "end")
			.text(function(d) { return d; });


	});
};