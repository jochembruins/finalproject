function dataBar(gemeente) {
    
    for (var i=0; i < dataMap.length; i++) {
        if (dataMap[i].CODE == gemeente){
            data = {"city":dataMap[i].CITY, "years": [{"year":2013, "E33":dataMap[i]['2013']}, 
                    {"year":2014, "E33":dataMap[i]['2014']}, 
                    {"year":2015, "E33":dataMap[i]['2015']},
                    {"year":2016, "E33":dataMap[i]['2016']},
                    {"year":2017, "E33":dataMap[i]['2017']}]};
            
            var parseTime = d3.timeParse("%Y")
            data.years.forEach(function(d) {
                d.year = parseTime(d.year)
                d.E33 = Number(d.E33.split('.').join(""));
            });

            if (isEmpty = document.getElementById('containerbar').innerHTML === "") {
                makeBar(data);
            } else {
                updateBar(data)
            }
            break;
        }
    }

}

function makeBar(data) {  
    
    console.log(data)
    bar = true

    margin = { top: 40, right: 20, bottom: 40, left: 70 },
    width = 718 - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom;

    
    var dataCity = data.years
    
    xBar = d3.scaleLinear()
        .range([0, width])
        .domain([0, d3.max(dataCity, function(d) { return d.E33; })]);

    yBar = d3.scaleBand()
        .range([0, height])
        .padding(0.1)
        .domain(dataCity.map(function(d) { return d.year; }));

    var svg = d3.select("#containerbar")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        
    g = svg.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var tip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-7, 0])
        .html(function(d) {
        return "<strong>E33-meldingen " + d.year.getFullYear() + ": </strong> <span style='color:red'>" + d.E33 + "</span>";
        });
    
    svg.call(tip);

    g.selectAll(".bar")
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

    yAxis = d3.axisLeft(yBar)
        .tickFormat(d3.timeFormat("%Y"));

    xAxis = d3.axisBottom(xBar)
        .ticks(6)

  // add the x Axis
  g.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
      .attr("class", "axis xaxis");

  // add the y Axis
  g.append("g")
      .call(yAxis)
      .attr("class", "axis yaxis") ;

    var labelX = g.append("text")
        .attr("x", width - margin.right * 4)
        .attr("y" , height + margin.bottom / 1.5)
        .text("Absoluut aantal E33-meldingen")
        .style("text-anchor", "middle")
        .style("font-size", "10px")
        .attr("class", "label");

            // adds title to the graph
    title = g.append("text")
        .attr("class", "title")
        .attr("x", width / 2)
        .attr("y", - margin.top / 3)
        .text("E33-meldingen in " + data.city)
        .style("text-anchor", "middle")
        .style("font-size", "20px")
        .style("font-family", "'Montserrat'");
}


function updateBar(data) {  
    console.log(data)
    
    var dataCity = data.years
    
    xBar.domain([0, d3.max(dataCity, function(d) { return d.E33; })]);
    yBar.domain(dataCity.map(function(d) { return d.year; }));

    var svg = d3.select("#containerbar")

    bars = svg.selectAll("rect")
        .data(dataCity);
        
    bars
        .enter()
        .append("rect"); 

    bars   
        .transition()
        .duration(300)
        .attr("x", 0)
        .attr("height", yBar.bandwidth())
        .attr("y", function(d) { return yBar(d.year); })
        .attr("width", function(d) { return xBar(d.E33); });

    bars
        .exit()
        .remove()

    var yAxis = d3.axisLeft(yBar)
        .tickFormat(d3.timeFormat("%Y"));

    var xAxis = d3.axisBottom(xBar)
        .ticks(6)


    svg.select(".xaxis")
        .transition()
        .call(xAxis)

    svg.select(".yaxis")
        .transition()
        .call(yAxis);

    title
        .transition()
        .duration(300)
        .text("E33-meldingen in " + data.city);



        
}