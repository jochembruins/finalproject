/*
* combined.js
*
* Jochem Bruins - 10578811
*
* Laadt een gecombineerde grafiek in index.html
*/

function prepData (error, response) {
	dataE33 = response[0].data;
	dataMedia = response[1].data;
	dataMap = response[2].data;
	dataPlot = response[3].data;


	console.log(dataMap)

	var parseTime = d3.timeParse("%Y-%m-%d");
	
	dataMedia.forEach(function(d) {
		d.DATE = parseTime(d.DATE);
		quarter = getQuarter(d.DATE)
		d.DATE.setDate(1);
		d.DATE.setMonth(quarter);
	})

	var parseYear = d3.timeParse("%Y");
	
	dataE33.forEach(function(d) {
		d.YEAR = parseYear(d.YEAR);
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
			.attr("class", "transform") 
			.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	var x = d3.scaleTime()
		.range([0, width])
		.domain(d3.extent(data, function(d) { return d.DATE; }));

	var y = d3.scaleLinear()
		.range([height, 0])
		.domain([0, d3.max(data, function(d) { return d.FREQUENCY; })]);

	var tickLabels = ['2011','Q2','Q3','Q4','2012','Q2','Q3','Q4','2013','Q2','Q3','Q4','2014','Q2','Q3','Q4','2015','Q2','Q3','Q4','2016','Q2','Q3','Q4','2017','Q2','Q3','Q4','2018','Q2']
	xAxis = d3.axisBottom(x)
		.ticks(30)
		// .tickSize(-height, 0, 0)
		.tickFormat(function(d,i){ return tickLabels[i] });	

	yAxis = d3.axisLeft(y)
		.ticks(12)

	
	svg.append("g")
		.attr("class", "axis") 
		.call(xAxis)
		.attr("transform", "translate(0," + (height) + ")");

	svg.append("g")
		.attr("class", "axis") 
		.call(yAxis);


	// Define the three lines
	line = d3.line()
		.curve(d3.curveBasis)
		.x(function(d) { return x(d.DATE); })
		.y(function(d) { return y(d.FREQUENCY); });

	svg.append("path")
		.attr("d", line(data))
		.attr("class", "line");

	annotations = [{
          type: d3.annotationCalloutCircle,
          note: {
            title: "Schietpartij in Alphen aan de Rijn",
            wrap: 110
          },
          //settings for the subject, in this case the circle radius
          subject: {
            radius: 10
          },
          x: 43,
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
          //settings for the subject, in this case the circle radius
          subject: {
            radius: 10
          },
          x: 480,
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
          //settings for the subject, in this case the circle radius
          subject: {
            radius: 10
          },
          x: 857,
          y: 19,
          dy: 15,
          dx: -60
        }].map(function(d){ d.color = "#E8336D"; return d})

   	const makeAnnotations = d3.annotation()
        .type(d3.annotationLabel)
        .annotations(annotations)

    var marks = svg.append("g")
        .attr("class", "annotation-group")
        .call(makeAnnotations)

    	// adds title to the graph
	var title = svg.append("text")
		.attr("class", "title")
		.attr("x", width / 2)
		.attr("y", - margin.top / 3)
		.text("Media-aandacht voor verwarde personen")
		.style("text-anchor", "middle")
		.style("font-size", "20px");

	var labelX = svg.append("text")
        .attr("x", width - margin.right / 2.5)
        .attr("y" , height + margin.bottom )
        .text("kwartaal")
        .style("text-anchor", "middle")
        .style("font-size", "12px")
        .attr("class", "label");


	var yLabel = svg.append("text")
		.attr("x", - height / 3.2)
		.attr("y", margin.left / 12 )
		.text("Artikelen over verwarde personen")
		.attr("dy", "1em")
		.style("text-anchor", "middle")
		.style("font-size", "9px")
		.attr("transform", "rotate(-90)")
		.attr("class", "label");


}

function updateCombi() {

	rects = d3.selectAll(".bar")
	console.log(rects)
	if (rects.empty()) {
		svg = d3.select(".transform")
			.append("g");

		var x = d3.scaleBand()
			.range([0, width * (29/30)])
			.domain(dataE33.map(function(d) { return d.YEAR; }))
			.paddingInner(0.05);
	    	
	    var y = d3.scaleLinear()
	    	.rangeRound([height, height/2])
	    	.domain([0, d3.max(dataE33, function(d) { return d.AMOUNT; })]);

	    var yAxis = d3.axisRight(y)
			.ticks(4);

		var tip = d3.tip()
	  		.attr('class', 'd3-tip')
	  		.offset([-7, 0])
	  		.html(function(d) {
	    	return "<strong>E33-meldingen " + d.YEAR.getFullYear() + ": </strong> <span style='color:red'>" + d.AMOUNT + "</span>";
	  	});
	  	svg.call(tip);

		var rect = svg.selectAll("rect")
	      	.data(dataE33)
			.enter()
			.append("rect")
	      	.attr("class", "bar")
			.attr("y", function(d) { return height; })
			.attr("x", function(d){ return x(d.YEAR); })
			.on("mouseover", tip.show)
	      	.on("mouseout", tip.hide)
			.transition().delay(function (d,i){ return i * 100;})
	 		.duration(100)
	      	.attr("width", function(d){ return x.bandwidth(); })
	      	.attr("y", function(d){ return y(d.AMOUNT); })
	      	.attr("height", function(d){ return height - y(d.AMOUNT); });

	    svg.append("g")
			.attr("transform", "translate(" + width + " ,0)")
			.attr("class", "axis") 
			.call(yAxis);

		var yLabel = svg.append("text")
			.attr("x", height/1.55)
			.attr("y", - width * 0.995)
			.text("E33-meldingen")
			.attr("dy", "1em")
			.style("text-anchor", "middle")
			.style("font-size", "10px")
			.attr("transform", "rotate(90)")
			.attr("class", "label");

		d3.select(".line")
			.moveToFront();

		d3.select(".annotation-group")
			.moveToFront();

		d3.selectAll(".axis")
			.moveToFront();

		
	    
	    showMap()
	    prepPlot()
	};
}