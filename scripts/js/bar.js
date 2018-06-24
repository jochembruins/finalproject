/*
* bar.js
*
* Jochem Bruins - 10578811
*
* Loads a barchart into index.html that can be updated.
*/

/*
* Prepares the data for a bar chart.
*/
function prepBar(city) {
	//loops over the data to find corresponding municipality
	for (var i=0; i < dataMap.length; i++) {
		// if found, make object with needed data
		if (dataMap[i].CODE == city){
			data = {"city":dataMap[i].CITY, "years": [{"year":2013, "E33":dataMap[i]['2013']}, 
					{"year":2014, "E33":dataMap[i]['2014']}, 
					{"year":2015, "E33":dataMap[i]['2015']},
					{"year":2016, "E33":dataMap[i]['2016']},
					{"year":2017, "E33":dataMap[i]['2017']}]};
			
			// parse time in right format and delete dot in number
			var parseTime = d3.timeParse("%Y")
			data.years.forEach(function(d) {
				d.year = parseTime(d.year);
				d.E33 = Number(d.E33.split('.').join(""));
			});

			// check is div is empty
			if (isEmpty = document.getElementById('containerbar').innerHTML === "") {
				// if so, make bar chart
				makeBar(data);
			} else {
				// else, update
				updateBar(data);
			};
			break;
		};
	};
};


/*
* Draws a bar chart for the 'E33-meldingen' between 2013 and 2017.
*/
function makeBar(data) {
	// set margins, height and width
	var margin = { top: 40, right: 20, bottom: 40, left: 40 },
	width = 650 - margin.left - margin.right,
	height = 300 - margin.top - margin.bottom;
	
	// get needed data for the bars
	var dataCity = data.years;
	
	// define x scale
	xBar = d3.scaleLinear()
		.range([0, width])
		.domain([0, d3.max(dataCity, function(d) { return d.E33; })]);

	// define y scale
	yBar = d3.scaleBand()
		.range([0, height])
		.padding(0.1)
		.domain(dataCity.map(function(d) { return d.year; }));

	// append svg to selected div
	var svg = d3.select("#containerbar")
		.append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
		.append("g")
			.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	// define tooltip
	var tip = d3.tip()
		.attr('class', 'd3-tip')
		.offset([-7, 0])
		.html(function(d) {
		return "<strong>E33-meldingen " + d.year.getFullYear() + 
				": </strong> <span style='color:rgb(66, 146, 198)'>" + 
				d.E33 + "</span>";
		});
	
	// call tooltip
	svg.call(tip);

	// append bars to svg
	svg.selectAll(".bar")
		.data(dataCity)
		.enter()
		.append("rect")
		.attr("class", "bar")
		.attr("x", 0)
		.attr("height", yBar.bandwidth())
		.attr("y", function(d) { return yBar(d.year); })
		.attr("width", function(d) { return xBar(d.E33); })
		.on("mouseover", tip.show)
		.on("mouseout", tip.hide);

	// define y axis
	var yAxis = d3.axisLeft(yBar)
		.tickFormat(d3.timeFormat("%Y"));

	// define x axis
	var xAxis = d3.axisBottom(xBar)
		.ticks(6);

	// add the x Axis
	svg.append("g")
		.attr("transform", "translate(0," + height + ")")
		.call(xAxis)
		.attr("class", "axis xaxis");

	// add the y Axis
	svg.append("g")
		.call(yAxis)
		.attr("class", "axis yaxis");

	// add label for x axis
	var labelX = svg.append("text")
		.attr("x", width - margin.right * 4)
		.attr("y" , height + margin.bottom / 1.5)
		.text("Absoluut aantal E33-meldingen")
		.style("text-anchor", "middle")
		.style("font-size", "10px")
		.attr("class", "label");

	// adds title to the graph
	var title = svg.append("text")
		.attr("class", "titlebar")
		.attr("x", width / 2)
		.attr("y", - margin.top / 2)
		.text("E33-meldingen in " + data.city)
		.style("text-anchor", "middle")
		.style("font-size", "20px");
};


/*
* Updates the bar chart with new data
*/
function updateBar(data) {  
	// select data needed for the bars
	var dataCity = data.years
	
	// update x scale
	xBar.domain([0, d3.max(dataCity, function(d) { return d.E33; })]);
	
	//update y scale
	yBar.domain(dataCity.map(function(d) { return d.year; }));

	// select svg
	var svg = d3.select("#containerbar")

	// select all rects
	var bars = svg.selectAll("rect")
		.data(dataCity);
		
	// append new data 
	bars.enter()
		.append("rect"); 

	// change bars with transition
	bars.transition()
		.duration(300)
		.attr("x", 0)
		.attr("height", yBar.bandwidth())
		.attr("y", function(d) { return yBar(d.year); })
		.attr("width", function(d) { return xBar(d.E33); });

	// remove old bars
	bars.exit()
		.remove();

	// define new y axis
	var yAxis = d3.axisLeft(yBar)
		.tickFormat(d3.timeFormat("%Y"));

	// define new x axis
	var xAxis = d3.axisBottom(xBar)
		.ticks(6);

	// select and change x axis
	svg.select(".xaxis")
		.transition()
		.call(xAxis);

	// select and change y axis
	svg.select(".yaxis")
		.transition()
		.call(yAxis);

	// select and change title
	svg.select(".titlebar")
		.transition()
		.duration(300)
		.text("E33-meldingen in " + data.city);		
};