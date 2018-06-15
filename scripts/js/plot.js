function prepPlot() {
	dataPlot.forEach(function (d) {
		d.E33 = parseFloat(d.E33.replace(",", "."));
		d.GGZ = parseFloat(d.GGZ.replace(",", "."));
	});
	console.log(dataPlot)
	makePlot(dataPlot)

}

function makePlot(data) {
	
	// set siza and margin
	var margin = {top: 50, right: 50, bottom: 70, left: 70};
    var width = 800 - margin.left - margin.right,
    	height = 500 - margin.top - margin.bottom;


	// determine X scale
	var xPlot = d3.scaleLinear()
		.domain([0, 12])
		.range([0, width])
		.clamp(true);

	// determine Y scale
	var yPlot = d3.scaleLinear()
		.domain([0, 400])
		.range([height, 0])
		.clamp(true);


	// determine X axis
	var xAxisPlot = d3.axisBottom(xPlot)
		.ticks(10);

	// determine Y axis
	var yAxisPlot = d3.axisLeft(yPlot)
		.ticks(10);


    // add svg to body
	var svg = d3.select("#svgscatter")
		.append("svg")
		.attr("class", "plot")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
		.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

     var tooltip = d3.select("body")
     	.append("div")
        .attr("class", "tooltips");
	
	// draw circles for scatterplot
	var circles = svg.selectAll("circle")
		.data(data)
		.enter()
		.append("circle")
		.attr("cx", function(d) {
        	return xPlot(d.E33);
   		})
   		.attr("cy", function(d) {
        	return yPlot(d.GGZ);
   		})
   		.attr("r", "3")
   		// show tooltip when mouse is on circle
		.on("mouseover", function(d){
			return tooltip
				.style("visibility", "visible")
				.html('<p>' + d.CITY + '</p>');
			})
		.on("mousemove", function(d) {
			return tooltip
				.style("top", (event.pageY-10)+"px")
				.style("left",(event.pageX+10)+"px")
			;})
		.on("mouseout", function(d) {
			return tooltip
				.style("visibility", "hidden");
			});

	// draw X-axis
	svg.append("g")
		.attr('transform', 'translate(0,' + height + ')')
		.call(xAxisPlot)
		

	// draw Y-axis
	svg.append("g")
		.call(yAxisPlot);



}