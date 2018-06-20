function prepPlot() {
	dataPlot.forEach(function (d) {
		d.E33 = parseFloat(d.E33.replace(",", "."));
		d.GGZ = parseFloat(d.GGZ.replace(",", "."));
	});
	makePlot(dataPlot)

}

function makePlot(data) {
	console.log(data)

	// set siza and margin
	var margin = {top: 40, right: 20, bottom: 40, left: 40};
    var width = 650 - margin.left - margin.right,
    	height = 400 - margin.top - margin.bottom;


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

    tooltip = d3.select("body")
    	.append("div")
        .attr("class", "tooltips")
        .style("text-align", "right")

	
	// draw circles for scatterplot
	var circles = svg.selectAll("circle")
		.data(data)
		.enter()
		.append("circle")
		.attr("class", "circle")
		.attr("cx", function(d) {
        	return xPlot(d.E33);
   		})
   		.attr("cy", function(d) {
        	return yPlot(d.GGZ);
   		})
   		.attr("id", function(d) {
        	return d.CODE;
   		})
   		.attr("r", "3")
   		.style("stroke", "rgb(193, 193, 193)")
   		.style("fill", function(d) {
        	return colorScale(Math.round(d.E33));
   		})
   		// show tooltip when mouse is on circle
		.on("mouseover", mouseOverPlot)
		.on("mousemove", mouseMovePlot)
		.on("mouseout", mouseOutPlot);

	// draw X-axis
	svg.append("g")
		.attr('transform', 'translate(0,' + height + ')')
		.attr("class", "axis")
		.call(xAxisPlot);
		
		

	// draw Y-axis
	svg.append("g")
		.attr("class", "axis")
		.call(yAxisPlot);
	
	 var labelX = svg.append("text")
        .attr("x", width - margin.right * 4.5)
        .attr("y" , height + margin.bottom / 1.5)
        .text("E33 meldingen per 1000 inwoners")
        .style("text-anchor", "middle")
        .style("font-size", "10px")
        .attr("class", "label");

    var yLabel = svg.append("text")
		.attr("x", - height / 4.5)
		.attr("y", margin.left / 8)
		.text("Kosten GGZ per verzekerde")
		.attr("dy", "1em")
		.style("text-anchor", "middle")
		.style("font-size", "10px")
		.attr("transform", "rotate(-90)")
		.attr("class", "label");

            // adds title to the graph
    var title = svg.append("text")
        .attr("class", "titlePlot")
        .attr("x", width / 2)
        .attr("y", - margin.top / 3)
        .text("Mogelijk verband met de GGZ")
        .style("text-anchor", "middle")
        .style("font-size", "20px");

}


function mouseOverPlot(d) {  

	var circleUnderMouse = this 
	
	d3.selectAll('.circle')
		.filter(function(d,i) {
      		return (this !== circleUnderMouse);
      	})
		.style('opacity', 0.5);


	d3.select(this)
		.transition()
        .duration(100)
        .attr("r", "12")


    gemeentes
    	.filter(function(a, i) {
    		return (d.CODE !== this.id);
        })
        .style('opacity', 0.3);

    return tooltip
		.style("visibility", "visible")
		.html("<p><b>" + d.CITY + "</p><p style='font-size:14px;'>" + d.E33.toFixed(2) + "</b> E33-meldingen per 1000 inwoners<br><b>&euro; " + d.GGZ.toFixed(2) + "</b> kosten GGZ per verzekerde</p>")

        
}

function mouseMovePlot(d) {  

    return tooltip
		.style("top", (event.pageY-10)+"px")
		.style("left",(event.pageX-300)+"px")
}


function mouseOutPlot(d) {

    d3.selectAll('.circle')
        .attr("r", "3")
        .style("opacity", 1); 

    gemeentes
    	.style("opacity", 1); 

    return tooltip
		.style("visibility", "hidden");

        
}