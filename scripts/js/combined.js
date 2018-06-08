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
    margin = {top: 30, right: 50, bottom: 30, left: 50},
    width = 960 - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom;

    var svg = d3.select("#containercombi")
    	.append("svg")
    	.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
		.append("g")
			.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	x = d3.scaleTime()
		.range([0, width])
		.domain(d3.extent(data, function(d) { return d.DATE; }));

	y = d3.scaleLinear()
		.range([height, 0])
		.domain([0, d3.max(data, function(d) { return d.FREQUENCY; })]);

	var tickLabels = ['2011','Q2','Q3','Q4','2012','Q2','Q3','Q4','2013','Q2','Q3','Q4','2014','Q2','Q3','Q4','2015','Q2','Q3','Q4','2016','Q2','Q3','Q4','2017','Q2','Q3','Q4','2018','Q2']
	xAxis = d3.axisBottom(x)
		.ticks(30)
		.tickSize(-height, 0, 0)
		.tickFormat(function(d,i){ return tickLabels[i] });	

	yAxis = d3.axisLeft(y)
		.ticks(12)
		.tickSize(width / 100)
	
	svg.append("g")
		.attr("class", "axis") 
		.call(xAxis)
		.attr("transform", "translate(0," + (height) + ")");

	svg.append("g")
		.attr("class", "axis") 
		.call(yAxis)

	// Define the three lines
	line = d3.line()
		.curve(d3.curveBasis)
		.x(function(d) { return x(d.DATE); })
		.y(function(d) { return y(d.FREQUENCY); });

	svg.append("path")

		.attr("d", line(data))
		.attr("class", "line");
}