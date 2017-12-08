var q = d3_queue.queue(2)
		.defer(d3.json, 'nld.json')
		.defer(d3.json, 'jsonified.json')
		.awaitAll(draw);

function draw(error, data) {

	if (error) throw error;

	var margin = 50,
		width = 960 - margin,
		height = 550 - margin;


	var format = d3.time.format("%Y-%m-%d");

	var colour = d3.scale.category20();

	var projection = d3.geo.mercator()
		.scale(1)
		.translate([0, 0]);

	var path = d3.geo.path()
		.projection(projection);

	var l = topojson.feature(data[0], data[0].objects.subunits).features[3],
		b = path.bounds(l),
		s = .2 / Math.max((b[1][0] - b[0][0]) / width, (b[1][1] - b[0][1]) / height),
		t = [(width - s * (b[1][0] + 2 * b[1][0])) / 2, (height - s * (b[1][1] + b[0][1])) / 2];

	var map = d3.select("#map").selectAll("path")
		.data(topojson.feature(data[0], data[0].objects.subunits).features).enter()
		.append("path")
		.attr("d", path)
		.attr("fill", function(d, i) {
			return colour(i);
		})
		.attr("class", function(d, i) {
			return d.properties.name;
		});

	// map.datum(function(d){
	// 	var normalized = d.properties[0]
	// 		.replace(/ /g, '_')
	// 		.replace(/\//g, '_');
	// 	d.properties[0] = normalized;
	// 	return d;
	// });

	map.attr('class', function(d){
		return d.properties[0];
	});

	var field = "Mission"

	console.log(data[1])

	var maxtemp = d3.max(data[1] , function(d){
		return d.gemhum;
	});

	var measure_scale = d3.scale.linear()
		.range([height, 100])
		.domain([0, maxtemp]);

	var measure_axis = d3.svg.axis()
		.scale(measure_scale)
		.orient("right");

	d3.select("#chart").append('g')
		.attr('class', 'y axis')
		.attr("transform", "translate(" + width + " , -15)")
		.call(measure_axis);

	d3.select(".y.axis")
		.append("text")
		.attr('class', 'label')
		.text("Average temp")
		.attr("transform", "translate(45,215) rotate(90)");
	
	var drawChart = function(field) {
		// remove previous chart
		d3.select('#chart').select('.x.axis').remove();
		d3.select('#chart').select('path').remove();

		d3.select('#heading')
			.text(field.replace(/_/g, ' '));

		// var province_data = data[1]
		// // .gemhum.filter(function(d) {
		// // 	return d[field];
		// // });

		var time_extent = d3.extent(data[1], function(d) {
			return format.parse(d['date']);
		});

		var time_scale = d3.time.scale()
			.range([0, width - margin])
			.domain(time_extent);

		var time_axis = d3.svg.axis()
			.scale(time_scale)
			.tickFormat(d3.time.format("%b '%y'"));

		d3.select('#chart').append('g')
			.attr('class', 'x axis')
			.attr('transform', "translate(" + margin + ',' + (height - 15) + ")")
			.call(time_axis)
			.selectAll("text")
				.attr("y", 0)
				.attr("x", 9)
				.attr("dy", ".35em")
				.attr("transform", "rotate(90)")
				.style("text-anchor", "start");

		var line = d3.svg.line()
			.x(function(d) {return time_scale(format.parse(d['date'])); })
			.y(function(d) {return measure_scale(+d[field]); });

		d3.select('#chart').append("path")
			.data(data[1], function(d){ return d})
			.attr("class", "line")
			.attr("d", line)
			.attr('transform', 'translate(' + margin + ', -15');

	};

	drawChart(field);

	var mover = function(d) {
		var province = d.properties.name;
		d3.select('#map path.' + province).style('fill', 'black');

		drawChart(province);
	};

	var mout = function(d) {
		var province = d.properties.name;
		d3.select('path.' + province).style('fill', '#eee');
	}

	map.on("mouseover", mover);
	map.on("mouseout", mout);
	// svg.append("rect")
	// 	.attr("class", "background")
	// 	.attr("width", width)
	// 	.attr("height", height);
		

	// var g = svg.append("g");
	// queue()
	// 	.defer(d3.json, 'states.json')
	// 	.defer(d3.json, 'cities.json')
	// 	.await(makeMyMap);

	// d3.json("nld.json", function(error, nld) {

	// 	if (error) throw error;

	// 	var l = topojson.feature(nld, nld.objects.subunits).features[3],
	// 		b = path.bounds(l),
	// 		s = .2 / Math.max((b[1][0] - b[0][0]) / width, (b[1][1] - b[0][1]) / height),
	// 		t = [(width - s * (b[1][0] + b[0][0])) / 2, (height - s * (b[1][1] + b[0][1])) / 2];

	// 	console.log(nld.objects.subunits.geometries.properties)
	// 	projection
	// 		.scale(s)
	// 		.translate(t);

	// 	svg.append("g")
	// 			.attr("class", "provinces")
	// 		.selectAll("path")
	// 			.data(topojson.feature(nld, nld.objects.subunits).features).enter()
	// 			.append("path")
	// 			.attr("d", path)
	// 			.attr("fill", function(d, i) {
	// 				return colour(i);
	// 			})
	// 			.attr("class", function(d, i) {
	// 				return d.properties.name;
	// 			});

	// 	console.log("test")

	// 	let hoverEnabled = false;
	// 		svg.on('mousedown', x => hoverEnabled = true)
	// 			.on('mouseup', x => hoverEnabled = false)
	// 		svg.selectAll('.provinces path').on('mouseover', function() {
	// 			if (hoverEnabled) {
	// 				this.class.list.add('hovered');
	// 			}
			
	// 	console.log("test2")  
	// 	svg.append("path")
	// 		.attr("class", "provinceborders")
	// 		.attr("d", path(topojson.mesh(nld, nld.objects.subunits, function(a, b) { return a !== b; })));
	// });
	};

	
