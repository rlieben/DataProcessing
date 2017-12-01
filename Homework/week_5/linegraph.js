/*
Minor programming
Raoul Lieben
10556346
*/

window.onload = function(){

	// define margin, width and height
	var margin = {top: 20, right: 20, bottom: 100, left: 50},
		width = 1000 + margin.left + margin.right,
		height = 300 + margin.top + margin.bottom;

	// create svg element
	var svg = d3.select("body").append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
	  .append("g")
		.attr("transform",
			  "translate(" + margin.left + "," + margin.top + ")");

	// appending name to svg element
	svg.append("text")
		.attr("x", 0)             
		.attr("y", 0 - (margin.top / 2))
		.attr("text-anchor", "left")  
		.style("font-size", "12px")
		.text("Name: Raoul Lieben ");

	// appending title to svg element
	svg.append("text")
		.attr("x", (width / 2))             
		.attr("y", 0 - (margin.top / 2))
		.attr("text-anchor", "middle")  
		.style("font-size", "12px") 
		.style("text-decoration", "underline")  
		.text("Average humidity in Maastricht and de Bilt with max and min range");

	// appending data source to svg element
	svg.append("text")
		.attr("x", 10)             
		.attr("y", height + margin.bottom - 5)
		.attr("text-anchor", "left")  
		.style("font-size", "12px")  
		.text("Source : http://projects.knmi.nl/klimatologie/daggegevens/selectie.cgi");

	// appending data source to svg element
	svg.append("text")
		.attr("x", width - (10 * margin.right))             
		.attr("y", height + margin.bottom - 5)
		.attr("text-anchor", "right")  
		.style("font-size", "12px") 
		.text("Toggle between cities by clicking on/off");

	// create time convert method
	var parseTime = d3.timeParse("%Y%m%d");

	// assign colors to city
	var color = d3.scaleOrdinal()
		.range(["red", "yellow"])
		.domain(["maas", "bilt"]);

	// set x and y axis
	var x = d3.scaleTime().rangeRound([0, width]),
		y = d3.scaleLinear().rangeRound([height, 0]);

	// create line for average
	var averageline = d3.line()
		.x(function(d) { return x(d.date); })
		.y(function(d) { return y(d.gemhum); });

	// create area for min and max values
	var minmaxarea = d3.area()
		.x(function(d) { return x(d.date); })
		.y0(function(d) { return y(d.minhum); })
		.y1(function(d) { return y(d.maxhum); });;

	// create rect element for tracking mouse
	var transpRect = svg.append("rect")
		.attr("x", 0)
		.attr("y", 0)
		.attr("width", width)
		.attr("height", height)
		.attr("fill", "white")
		.attr("opacity", 0);


	// create vertical line
	var verticalLine = svg.append("line")
		.attr("opacity", 0)
		.attr("y1", 0)
		.attr("y2", height)
		.attr("stroke", "black")
		.attr("stroke-width", 1);



	// load data
	d3.json('jsonifiednew.json', function(error,data) {

		// errorcheck
		if (error) throw error;

		// converts value to number instead of string
		data.forEach(function(d) {
				
			d.date = parseTime(d.date);
			d.gemhum = +d.gemhum;
			d.minhum = +d.minhum;
			d.maxhum = +d.maxhum;
			return d;

		});

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
			
		// sort the entries by city
		var data_city = d3.nest()
			.key(function(d) {return d.city;})
			.entries(data);

		// set domains for x and y
		x.domain(d3.extent(data, function(d) { return d.date; }))
		y.domain([d3.min(data, function(d) { return d.minhum; }),
				d3.max(data, function(d) { return d.maxhum; })
		]);

		// create space for 
		legendmargin = width/data_city.length; // spacing for the legend

		// iterate for both cities
		data_city.forEach(function(d,i) {
		
			// append average line
			svg.append("path")
			.attr("class", "line")
			.style("stroke", function() { // Add the colours dynamically
				return d.color = color(d.key); })
			.attr("id", "tag_avehum_line" + d.key) // assign ID
			.attr("d", averageline(d.values));

			// append area of min and max values
			svg.append("path")
				.attr("class", "area")
				.style("fill", function() {
					return d.color = color(d.key);	})
				.style("opacity", "0.1")
				.style("stroke", "green")
				.attr("id", "tag_minmax_area" + d.key)
				.attr("d", minmaxarea(d.values));

			// add the switch between cities, with active click
			svg.append("text")
				.attr("x", (legendmargin/2)+i*legendmargin)
				.attr("y", height + (margin.bottom/2) + 30)
				.attr("class", "legend")
				.style("stroke", function() { 
					return d.color = color(d.key); })
				.on("click", function(){

					// active click function
					var active   = d.active ? false : true,
					 avehum_line = active ? 0 : 1;
					d3.select("#tag_avehum_line" + d.key)
						.transition().duration(100)
						.style("opacity", avehum_line);
					minmax_area = active ? 0 : 0.2;
					d3.select("#tag_minmax_area" + d.key)
						.transition().duration(100)
						.style("opacity", minmax_area)
					
					// show what is clicked
					d.active = active;
					})
				.text(d.key);

			// append x-axis
			svg.append("g")
				.attr("transform", "translate(0," + height + ")")
				.call(d3.axisBottom(x))
				.select(".domain")
					.remove();

			// append y - axis
			svg.append("g")
				.call(d3.axisLeft(y))
				.append("text")
					.attr("fill", "#000")
					.attr("transform", "rotate(-90)")
					.attr("y", 6)
					.attr("dy", "0.71em")
					.attr("text-anchor", "end")
					.text("Average humidity (%)");

		})

		// track mouse on rect
		transpRect.on("mousemove", function(){  
			mouse = d3.mouse(this);
			mousex = mouse[0];
			
			verticalLine.attr("x1", mousex).attr("x2", mousex).attr("opacity", 1);
		}).on("mouseout", function(){  
			verticalLine.attr("opacity", 0);

		});
	}
	);
};
	

