/*
* combined.js
*
* Jochem Bruins - 10578811
*
* Laadt een gecombineerde grafiek in index.html
*/

function prepData (error, response) {
	dataE33 = response[0];
	dataMedia = response[1].data;

	console.log(dataMedia)

	var parseTime = d3.timeParse("%Y-%m-%d");
	
	dataMedia.forEach(function(d) {
		d.DATE = parseTime(d.DATE);
		quarter = getQuarter(d.DATE)
		d.DATE.setDate(1);
		d.DATE.setMonth(quarter);
	})
	getFrequency(dataMedia)
}


function getQuarter(d) {
	var q = [0,3,6,9];
	return (q[Math.floor(d.getMonth() / 3)]);
}

function getFrequency(data) {
	var tally = {};

	data.forEach(function(d) {
		date = d.DATE.toString()
		tally[date] = (tally[date] || 0) + 1;
	})

	var data = [];

	for (var date in tally) {
	    if (tally.hasOwnProperty(date)) {
	        data.push({
	            DATE: new Date(date),
	            FREQUENCY: tally[date]
	        });
    	}
    }	
    console.log(data)
    makeLine(data)
}


function makeLine(data){
	var svg = d3.select("svg"),
	    margin = {top: 30, right: 50, bottom: 30, left: 50},
	    width = svg.attr("width") - margin.left - margin.right,
	    height = svg.attr("height") - margin.top - margin.bottom,
	    g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");


	var x = d3.scaleTime().range([0, width]),
	    y = d3.scaleLinear().range([height, 0]),

	var line = d3.line()
	    .curve(d3.curveBasis)
	    .x(function(d) { return x(d.DATE); })
	    .y(function(d) { return y(d.FREQUENCY); });


	x.domain(d3.extent(data, function(d) { return d.DATE; }));

	y.domain([
	    d3.min(cities, function(c) { return d3.min(c.values, function(d) { return d.temperature; }); }),
	    d3.max(cities, function(c) { return d3.max(c.values, function(d) { return d.temperature; }); })
	  ]);

	  z.domain(cities.map(function(c) { return c.id; }));

	  g.append("g")
	      .attr("class", "axis axis--x")
	      .attr("transform", "translate(0," + height + ")")
	      .call(d3.axisBottom(x));

	  g.append("g")
	      .attr("class", "axis axis--y")
	      .call(d3.axisLeft(y))
	    .append("text")
	      .attr("transform", "rotate(-90)")
	      .attr("y", 6)
	      .attr("dy", "0.71em")
	      .attr("fill", "#000")
	      .text("Temperature, ºF");

	  var city = g.selectAll(".city")
	    .data(cities)
	    .enter().append("g")
	      .attr("class", "city");

	  city.append("path")
	      .attr("class", "line")
	      .attr("d", function(d) { return line(d.values); })
	      .style("stroke", function(d) { return z(d.id); });

	  city.append("text")
	      .datum(function(d) { return {id: d.id, value: d.values[d.values.length - 1]}; })
	      .attr("transform", function(d) { return "translate(" + x(d.value.date) + "," + y(d.value.temperature) + ")"; })
	      .attr("x", 3)
	      .attr("dy", "0.35em")
	      .style("font", "10px sans-serif")
	      .text(function(d) { return d.id; });
	
}