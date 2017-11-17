// Raoul Lieben
// Minor programming, University of Amsterdam


// defining svg element
var margin = {top: 40, right: 30, bottom: 60, left: 40},
width = 960 - margin.left - margin.right,
height = 500 - margin.top - margin.bottom;

// creating x variable
var x = d3.scale.ordinal()
	.rangeRoundBands([0, width], .1);

// creating y variable
var y = d3.scale.linear()
	.range([height, 0]);

// creating x axis
var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

// creating y axis
var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .ticks(10, "mm");

// creating tip on bar
var tip = d3.tip()
 	.attr('class', 'd3-tip')
  	.offset([-10, 0])
  	.html(function(d) {
    	return "<strong>Rain:</strong> <span style='color:red'>" + d.rain + "mm</span>";
  	});

// create chart incl margins
var chart = d3.select(".chart")
    	.attr("width", width + margin.left + margin.right)
    	.attr("height", height + margin.top + margin.bottom)
  	.append("g")
    	.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// connect tip onto chart
chart.call(tip);

// call json data
d3.json("jsonified.json", function(error, data) {

	
	
	// all negative values (rainfall < 0.05mm) of KNMI data set to zero
	for (i = 0; i < data.length; i++){

		if (data[i]["rain"] < 0){
			data[i]["rain"] = "0"
		}

	};

	// setting domains for x
	x.domain(data.map(function(d) { return d.date; }));

	// setting domains for y
	y.domain([0, d3.max(data, function(d) { return d.rain; })]);

	// append x-axis values to chart
	chart.append("g")
			.attr("class", "x axis")
      	.attr("transform", "translate(0," + height + ")")
      	.call(xAxis)
      	.selectAll("text")  
		    .style("text-anchor", "end")
		    .attr("dx", "-.15em")
		    .attr("dy", ".25em")
		    .attr("transform", "rotate(-65)");
	    
	// append y-axis values to chart
  	chart.append("g")
		    .attr("class", "y axis")
		    .call(yAxis)
		.append("text")
		    .attr("transform", "rotate(-90)")
		    .attr("y", 6)
		    .attr("dy", ".71em")
		    .style("text-anchor", "end")
		    .text("Rain");

	// append data in rectangular bar format in corresponding ranges
	chart.selectAll(".bar")
	    	.data(data)
	    .enter().append("rect")
	      	.attr("class", "bar")
	      	.attr("x", function(d) { return x(d.date); })
	      	.attr("width", x.rangeBand())
	      	.attr("y", function(d) { return y(d.rain); })
	      	.attr("height", function(d) { return height - y(d.rain); })
	      	// showing and hiding tip
	     	.on('mouseover', tip.show)
			.on('mouseout', tip.hide);

});

// function do scan through data
function type(d) {

    d.rain = +d.rain; 
    return d;
};


