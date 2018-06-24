/*
* map.js
*
* Jochem Bruins - 10578811
*
* Loads a datamap into index.html
*/

/*
* Selects the div and makes it visible.
*/
function showMap() {
	var div = document.getElementById("mapbar");
	div.style.visibility = "visible";

	// draw map and barchart 
	makeMap(dataMap)
	prepBar('GM0363')
};


/*
* Draws a datamap that shows the amount of 'E33-meldingen'.
*/
function makeMap(dataMap) { 
	// select svg elements from external svg
	var svgMap = d3.select(document.getElementById("svgmap").contentDocument);
	var svgItem = svgMap.select("#gemeentes");
	gemeentes = svgItem.selectAll("path");

	// make color scale for map
	colorScale = d3.scaleLinear()
		.domain([1, 5])
		.interpolate(d3.interpolateHcl)
		.range([d3.rgb('#f7fbff'), d3.rgb('#4292c6')])
		.clamp(true);

	// loop through data to assign part of the map to it
	for (var i=0; i < dataMap.length; i++) {
		var gemeenteData = dataMap[i]; 
		var id = gemeenteData.CODE; 
		
		// loop through parts of the svg map
		gemeentes.each(function (d, i) {
			selection = d3.select(this);
			
			// match on id
			if (selection.attr("id") == id){
				// assign all data as attributes
				selection.attr("R2013", gemeenteData.R2013);				 
				selection.attr("R2014", gemeenteData.R2014);
				selection.attr("R2015", gemeenteData.R2015);
				selection.attr("R2016", gemeenteData.R2016);
				selection.attr("R2017", gemeenteData.R2017);
				selection.attr("class", "gemeente");
				// fill path with color depending on the data
				selection.style("fill", colorScale(Math.round(parseFloat(selection.attr("R2017")))));  
			};
		});
	};
		
	// change style and and mouse event
	gemeentes
		.style("stroke-width", "0.5")
		.on("click", getId)
		.on("mouseover", mouseOver)
		.on("mouseout", mouseOut);

	// add legend
	makeLegend();
};


/*
* Draws a legend with the map.
*/
function makeLegend() {
	// set margin, width and height
	var margin = 10,
		width = 500 - margin,
		height = 30 - margin;

	// set colors
	var colorRange = ['#f7fbff', '#4292c6']
		
	// set color scale
	var color = d3.scaleLinear()
		.range(colorRange)
		.domain([1, 2]);

	// append svg to div
	var svg = d3.select('#svgContainer')
		.append('svg')
		.attr("width", width + (margin * 2))
		.attr("height", height + (margin * 2))
		.append("g")
		.attr("transform", "translate(" + (margin) + "," + (margin) + ")");

	// define gradient
	var gradient = svg.append("defs")
		.append("linearGradient")
		.attr("id", "gradient");
		   
	// add start color
	gradient.append("stop")
		.attr("offset", "0%")
		.attr("stop-color", color(1));

	// add stop color
	gradient.append("stop")
		.attr("offset", "100%")
		.attr("stop-color", color(2));

	// append rect with gradient
	svg.append("rect")
		.attr("x", 0)
		.attr("y", 0)
		.attr("width", width)
		.attr("height", height)
		.style("stroke", "rgb(193, 193, 193)")
		.style("stroke-width", 1)
		.style("fill", "url(#gradient)");

	// custom labels
	var labels = ['< 1', '2', '3', '4', '5 >'];
	
	// append label for legend
	svg.append("text")
		.attr("x", width / 5.2)
		.attr("y" , - margin / 3.5)
		.text('E33-meldingen per 1000 inwoners')
		.style("text-anchor", "middle")
		.style("font-size", "10px")
		.attr("class", "label");

	// loop to add all custom labels
	for (var i = 0; i < labels.length; i++) {
		svg.append("text")
			.attr("x", 0 + (width / 4) * i)
			.attr("y" , height + margin)
			.text(labels[i])
			.style("text-anchor", "middle")
			.style("font-size", "10px")
			.attr("class", "label"); 
	};
};


/*
* Function that changes the border of the path and interacts with the scatterplot.
*/
function mouseOver(d) {  
	// bring element to front and make border thicker
	d3.select(this)
		.moveToFront()
		.style("stroke-width", "1.5");

	// get idea so we can use it to filter
	var id = this.id;

	// select all other circles in scatterplot and change opacity
	d3.selectAll('circle')
		.filter(function(a) {
			return (id !== a.CODE);
		})
		.style('opacity', 0.4);

	// enlarge radius corresponding circle
	d3.selectAll('circle')
		.filter(function(a) {
			return (id === a.CODE);
		})
		.attr("r", "12")
		.moveToFront()

	// select circle again by id 
	var circle = document.getElementById(id)

	// get location if circle exists
	if (circle != null) {
		var loc = circle.getBoundingClientRect()

		var dataTip;

		// select corresponding data for tooltip
		for (var i=0; i < dataPlot.length; i++) {
			if (dataPlot[i].CODE == id){
				dataTip = dataPlot[i];
				break;
			};
		};
		//return tooltip at location of the corresponding circle in scatterplot
		return tooltip
			.style("visibility", "visible")
			.html("<p><b>" + dataTip.CITY + "</p><p style='font-size:14px;'>" + 
					dataTip.E33.toFixed(2) + "</b> E33-meldingen per 1000 inwoners<br><b>&euro; " + 
					dataTip.GGZ.toFixed(2) + "</b> kosten GGZ per verzekerde</p>")
			.style("left", loc.x - 280 +"px")
			.style("top", loc.y + window.scrollY +"px");
	};	
};


/*
* Sets style back and hides tooltip.
*/
function mouseOut(d) {
	// set border with back
	d3.select(this)
		.style("stroke-width", "0.5");

	// reset opacity and radius from all circles in scatterplot
	d3.selectAll('circle')
		.style('opacity', 1)
		.attr("r", "3");
	
	// hide tooltip
	return tooltip
			.style("visibility", "hidden");
};


/*
* change colors of 'gemeentes' when one is clicked and get id for bar chart.
*/
function getId(d, i) {  
	// gets year from slider
	var year = document.getElementById("myRange").value;
	
	// resets color of all 'gemeentes' according to the data in the year
	gemeentes.each(function (d, i) {
		selection = d3.select(this)   
		selection.style("fill", colorScale(Math.round(parseFloat(selection.attr("R"+year)))));
	});

	// make selected 'gemeente' purple when clicked
	d3.select(this)
		.style("fill", "rgb(153,112,171)");

	// get id
	var gemeente = d3.select(this).attr('id');

	// cal function that makes bar chart
	prepBar(gemeente);		 
};


/*
* Updates the map when slider is changed.
*/
function updateMap(year) {
	// updates the current year next to the slider
	d3.select("#slideroutput").html(year);

	// change color of the map according to the selected year
	gemeentes.each(function (d, i) {
		var selection = d3.select(this);   
		selection.style("fill", colorScale(Math.round(parseFloat(selection.attr("R"+year)))));	  
	});
	
};




