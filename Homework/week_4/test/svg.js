/*
Raoul Lieben
Minor programming
10556346
*/

d3.xml("test.svg", "image/svg+xml", function(error, xml) {
    if (error) throw error;    
    document.body.appendChild(xml.documentElement); 

    // values for the legend
    var legend = {"values": [
    		{"color" : "#ccece6", "tekstdata" : "100"},
    		{"color" : "#99d8c9", "tekstdata" : "1000"},
			{"color" : "#66c2a4", "tekstdata" : "10000"},
			{"color" : "#41ae76", "tekstdata" : "100000"},
			{"color" : "#238b45", "tekstdata" : "1000000"},
			{"color" : "#005824", "tekstdata" : "10000000"},
			{"color" : "#FFFFFF", "tekstdata" : "Unknown data"}
    ]};

    // defining variables
    var width_rect = 21,
    	height_rect = 29,
    	xvalue_rect = 13,
    	xvalue_text = 46.5,
    	begin_yrect = 10,
    	begin_ytext = 30,
    	scale_elements = 40;

    // select svg element and creating legend color rects and fillings
	d3.select("#Laag_1").selectAll("#st1").data(legend.values)
    	.enter()
			.append("rect")
			.attr("width", width_rect)
			.attr("height", height_rect)
			.attr('x', xvalue_rect)
			.attr('y', function(d,i){ return begin_yrect + i * scale_elements})
			.style("fill", function(d,i){ return legend.values[i].color})
			.style("stroke", "000000");

	// setting values
	d3.select("#Laag_1").selectAll("#st1").data(legend.values)
    	.enter()
			.append("text")
			.attr('x', xvalue_text)
			.attr('y', function(d,i){ return begin_ytext + i * scale_elements})
			.text(function(d,i){ return legend.values[i].tekstdata})
			.style("fill", legend.values[5].color)

});