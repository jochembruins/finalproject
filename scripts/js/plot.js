/*
* plot.js
*
* Jochem Bruins - 10578811
*
* Loads a scatterplot into index.html
*/

/*
* Prepares the data for the scatterplot.
*/
function prepPlot() {
	// replace commas by dots
	dataPlot.forEach(function (d) {
		d.E33 = parseFloat(d.E33.replace(",", "."));
		d.GGZ = parseFloat(d.GGZ.replace(",", "."));
	});

	makePlot(dataPlot);
};


/*
* Draws the scatterplot.
*/
function makePlot(data) {
	// set size and margin
	var margin = {top: 40, right: 20, bottom: 40, left: 40},
		width = 650 - margin.left - margin.right,
		height = 400 - margin.top - margin.bottom;

	// determine x scale
	var xPlot = d3.scaleLinear()
		.domain([0, 12])
		.range([0, width])
		// extreme values are put on the sides
		.clamp(true);

	// determine y scale
	var yPlot = d3.scaleLinear()
		.domain([0, 400])
		.range([height, 0])
		// extreme values are put on the sides
		.clamp(true);

	// determine X axis
	var xAxisPlot = d3.axisBottom(xPlot)
		.ticks(10);

	// determine Y axis
	var yAxisPlot = d3.axisLeft(yPlot)
		.ticks(10);

	// add svg to selected div
	var svg = d3.select("#svgscatter")
		.append("svg")
		.attr("class", "plot")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
		.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	// append tooltip to body
	tooltip = d3.select("body")
		.append("div")
		.attr("class", "tooltips");

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
	
	// add label for x axis
	var labelX = svg.append("text")
		.attr("x", width - margin.right * 4.5)
		.attr("y" , height + margin.bottom / 1.5)
		.text("E33 meldingen per 1000 inwoners")
		.style("text-anchor", "middle")
		.style("font-size", "10px")
		.attr("class", "label");

	// add label for y axis
	var yLabel = svg.append("text")
		.attr("x", - height / 4.5)
		.attr("y", margin.left / 8)
		.text("Kosten GGZ per verzekerde")
		.attr("dy", "1em")
		.style("text-anchor", "middle")
		.style("font-size", "10px")
		.attr("transform", "rotate(-90)")
		.attr("class", "label");

	// add title to the graph
	var title = svg.append("text")
		.attr("class", "titlePlot")
		.attr("x", width / 2)
		.attr("y", - margin.top / 3)
		.text("Mogelijk verband met uitgaven GGZ (2016)")
		.style("text-anchor", "middle")
		.style("font-size", "20px");

	// add information (i) image next tot the title
	svg.append("image")
  		.attr("xlink:href", "https://png.icons8.com/metro/1600/info.png")
	  	.attr("x", width / 1.15)
	  	.attr("y", - margin.top / 1.35)
	  	.attr("width", "18px")
	  	.attr("height", "18px")
	  	// mouseover function that shows div with information
	  	.on("mouseover", mouseOverInfo)
		.on("mouseout", mouseOutInfo);

	// add information to graph
	info = d3.select("body")
		.append("div")
		.style("visibility", "hidden");
};


/*
* Changes the opacity and size of the circles on mouse over.
* Also changes the opacity of the other cities in the map.
*/
function mouseOverPlot(d) {  
	// store selection
	var circleUnderMouse = this;
	
	// fade all other circles
	d3.selectAll('.circle')
		.filter(function(d,i) {
	  		return (this !== circleUnderMouse);
	  	})
		.style('opacity', 0.5);

	// enlarge selected circle
	d3.select(circleUnderMouse)
		.attr("r", "12");

	// fade all other cities in the map
	gemeentes
		.filter(function(a, i) {
			return (d.CODE !== this.id);
		})
		.style('opacity', 0.3);

	// return corresponding data to the tooltip
	return tooltip
		.style("visibility", "visible")
		.html("<p><b>" + d.CITY + "</p><p style='font-size:14px;'>" + 
			d.E33.toFixed(2) + "</b> E33-meldingen per 1000 inwoners<br><b>&euro; " + 
			d.GGZ.toFixed(2) + "</b> kosten GGZ per verzekerde</p>");	
};


/*
* Returns the location of the tooltip.
*/
function mouseMovePlot(d) {  
	return tooltip
		.style("top", (event.pageY-10)+"px")
		.style("left",(event.pageX-300)+"px");
};


/*
* Resets the map and circles and hides the tooltip.
*/
function mouseOutPlot(d) {
	// make all circles unfaded
	d3.selectAll('.circle')
		.attr("r", "3")
		.style("opacity", 1); 

	// make all cities in map unfaded
	gemeentes
		.style("opacity", 1); 

	// hide tooltip
	return tooltip
		.style("visibility", "hidden");
};


/*
* Shows information about the graph when mouse in on info button.
*/
function mouseOverInfo() {
	// return location and information
	return info
		.style("top", (event.pageY+30)+"px")
		.style("left",(event.pageX-480)+"px")
		.attr("class", "info")
		.style("visibility", "visible")
				.html('<h4>Uitleg puntenwolk</h4><p>Bezuinigingen op de GGZ \
				(geestelijke gezondheidszorg) worden vaak als mogelijke \
				oorzaak genoemd voor de stijging in E33-meldingen. \
				Dit is moeilijk te controleren.</p><p>Er is wel bekend hoe \
				veel de verzekeraars in Nederland uitgeven aan (de verschillende \
				onderdelen van) de GGZ. Onderstaande puntenwolk onderzoekt \
				of er een verband is tussen de uitgaven aan de GGZ per gemeente \
				en de hoeveelheid E33-meldingen in diezelfde plaats.</p>\
				<p>Disclaimer: Onderstaande visualisatie toont alleen de gegevens van \
				2016 en verandert niet mee met de kaart. Punten die zich ter hoogte \
				van het uitende van de assen bevinden, hebben mogelijk nog extremere \
				waarden. Ga eroverheen met de muis om de absolute waarden te zien.</p>');
		
};


/*
* Hides information when mouse is off.
*/
function mouseOutInfo() {
	return info
		.style("visibility", "hidden");
};