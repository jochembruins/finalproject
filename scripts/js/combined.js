/*
* combined.js
*
* Jochem Bruins - 10578811
*
* Loads an combined graph into index.html.
*/

/*
* Prepares the data for the combined graph
*/
function prepCombi(dataMedia, dataE33) {
	// variable to parse time in right format
	var parseTime = d3.timeParse("%Y-%m-%d");
	
	// get date to right format and set it to the first day of the quarter
	dataMedia.forEach(function(d) {
		d.DATE = parseTime(d.DATE);
		var quarter = getQuarter(d.DATE)
		d.DATE.setDate(1);
		d.DATE.setMonth(quarter);
	});

	// variable to parse time in right format format for bars 
	var parseYear = d3.timeParse("%Y");
	
	// set date in right format
	dataE33.forEach(function(d) {
		d.YEAR = parseYear(d.YEAR);
	})
	
	getFrequency(dataMedia);
}


/*
* Gets amount of articles puplished per quarter 
* needed for line in combined graph.
*/
function getFrequency(data) {
	// make empty object for all quarters and their frequency
	var count = {};

	// checks for unique dates and counts +1 if date already exists
	data.forEach(function(d) {
		date = d.DATE.toString()
		count[date] = (count[date] || 0) + 1;
	})

	// empty list to store final frequency data
	var data = [];

	// push objects in right format with their data and frequency
	for (var date in count) {
		if (count.hasOwnProperty(date)) {
			data.push({
				DATE: new Date(date),
				FREQUENCY: count[date]
			});
		};
	};	

	makeLine(data);
};

/*
* returns a number that stands for the first month of the quarter.
*/
function getQuarter(d) {
	var q = [0,3,6,9];
	return (q[Math.floor(d.getMonth() / 3)]);
};

/*
* Makes the first part of the linegraph: the line.
*/
function makeLine(data){
	// all margins, width and height
	margin = {top: 30, right: 50, bottom: 30, left: 50},
	width = 840 - margin.left - margin.right,
	height = 300 - margin.top - margin.bottom;

	// add svg to specifiv div
	var svg = d3.select("#containercombi")
		.append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
		.append("g")
			.attr("class", "transform") 
			.attr("transform", "translate(" + margin.left + "," 
					+ margin.top + ")");

	// scale for x axis
	var x = d3.scaleTime()
		.range([0, width])
		.domain(d3.extent(data, function(d) { return d.DATE; }));

	// scale for y axis
	var y = d3.scaleLinear()
		.range([height, 0])
		.domain([0, d3.max(data, function(d) { return d.FREQUENCY; })]);

	// custom tick labels
	var tickLabels = ['2011','Q2','Q3','Q4','2012','Q2','Q3','Q4','2013',
						'Q2','Q3','Q4','2014','Q2','Q3','Q4','2015','Q2',
						'Q3','Q4','2016','Q2','Q3','Q4','2017','Q2','Q3',
						'Q4','2018','Q2'];
	
	// declare x axis
	xAxis = d3.axisBottom(x)
		.ticks(30)
		// add custom tick labels
		.tickFormat(function(d,i){ return tickLabels[i] });	

	// declare y axis
	yAxis = d3.axisLeft(y)
		.ticks(12);

	// append x axis
	svg.append("g")
		.attr("class", "axis") 
		.call(xAxis)
		.attr("transform", "translate(0," + (height) + ")");

	// append y axis
	svg.append("g")
		.attr("class", "axis") 
		.call(yAxis);

	// define the line
	line = d3.line()
		.curve(d3.curveBasis)
		.x(function(d) { return x(d.DATE); })
		.y(function(d) { return y(d.FREQUENCY); });

	// append line to svg
	svg.append("path")
		.attr("d", line(data))
		.attr("class", "line");

	// add annotations that explain certain peaks in the graph
	// using d3-annotation: http://d3-annotation.susielu.com
	annotations = [{
		type: d3.annotationCalloutCircle,
		note: {
			title: "Schietpartij in Alphen aan de Rijn",
			wrap: 110
		},
		subject: {
			// size of circle
			radius: 10
		},
		// position
		x: 41,
		y: 137,
		dy: -30,
		dx: 20
	},
	{
		type: d3.annotationCalloutCircle,
		note: {
			title: "Arrestatie moordenaar Els Borst",
			wrap: 130
		},
		subject: {
			radius: 10
		},
		x: 412,
		y: 35,
		dy: 40,
		dx: -60
	},
	{
		type: d3.annotationCalloutCircle,
		note: {
			title: "Steekpartij Den Haag door verwarde Syrier",
			wrap: 140
		},
		subject: {
			radius: 10
		},
		x: 735,
		y: 19,
		dy: 15,
		dx: -60
	}]
	//set color of annotations to black
	.map(function(d){ d.color = "#000000"; return d});

	// declare annotations in variable
	var makeAnnotations = d3.annotation()
		.type(d3.annotationLabel)
		.annotations(annotations);

	// add annotations to svg
	svg.append("g")
		.attr("class", "annotation-group")
		.call(makeAnnotations);

	// adds title to the graph
	var title = svg.append("text")
		.attr("class", "title")
		.attr("x", width / 2)
		.attr("y", - margin.top / 3)
		.text("Media-aandacht voor verwarde personen")
		.style("text-anchor", "middle")
		.style("font-size", "20px");

	// adds label on x axis
	var labelX = svg.append("text")
		.attr("x", width - margin.right / 2.5)
		.attr("y" , height + margin.bottom )
		.text("kwartaal")
		.style("text-anchor", "middle")
		.style("font-size", "12px")
		.attr("class", "label");

	// adds label to y axis 
	var yLabel = svg.append("text")
		.attr("x", - height / 3.2)
		.attr("y", margin.left / 12 )
		.text("Artikelen verwarde personen")
		.attr("dy", "1em")
		.style("text-anchor", "middle")
		.style("font-size", "9px")
		.attr("transform", "rotate(-90)")
		.attr("class", "label");
};


/*
* Adds bars with the 'E33-meldingen' to the combined chart.
*/
function updateCombi() {
	// check if rects already exist
	var rects = d3.selectAll(".bar");

	// if not, draw them
	if (rects.empty()) {
		// select part of the svg to draw in
		svg = d3.select(".transform")
			.append("g");

		// create new axis
		var x = d3.scaleBand()
			.range([0, width * (29/30)])
			.domain(dataE33.map(function(d) { return d.YEAR; }))
			.paddingInner(0.05);
			
		var y = d3.scaleLinear()
			.rangeRound([height, height/2])
			.domain([0, d3.max(dataE33, function(d) { return d.AMOUNT; })]);

		// declare y axis
		var yAxis = d3.axisRight(y)
			.ticks(4);

		// declare tooltip
		var tip = d3.tip()
			.attr('class', 'd3-tip')
				.offset([-7, 0])
			.html(function(d) {
				return "<strong>E33-meldingen " + d.YEAR.getFullYear() + 
						": </strong> <span style='color:rgb(66, 146, 198)'>" 
						+ d.AMOUNT + "</span>";
			});
		
		svg.call(tip);

		// append the bars to the svg
		var rect = svg.selectAll("rect")
			.data(dataE33)
			.enter()
			.append("rect")
			.attr("class", "bar")
			.attr("y", function(d) { return height; })
			.attr("x", function(d){ return x(d.YEAR); })
			.on("mouseover", tip.show)
			.on("mouseout", tip.hide)
			//add transition to show the bars.
			.transition()
				// delay to draw them after each other 
				.delay(function (d,i){ return i * 100;})
		 		.duration(100)
				.attr("width", function(d){ return x.bandwidth(); })
				.attr("y", function(d){ return y(d.AMOUNT); })
				.attr("height", function(d){ return height - y(d.AMOUNT); });

		// append axis to svg
		svg.append("g")
			.attr("transform", "translate(" + width + " ,0)")
			.attr("class", "axis") 
			.call(yAxis);

		// add label on y axis
		var yLabel = svg.append("text")
			.attr("x", height / 1.45)
			.attr("y", - width * 0.995)
			.text("E33-meldingen")
			.attr("dy", "1em")
			.style("text-anchor", "middle")
			.style("font-size", "10px")
			.attr("transform", "rotate(90)")
			.attr("class", "label");

		// bring some elements to the fron for better looking result
		d3.select(".line")
			.moveToFront();

		d3.select(".annotation-group")
			.moveToFront();

		d3.selectAll(".axis")
			.moveToFront();
		
		// draw map and plot as well
		showMap()
		prepPlot()
	};
};
