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

    margin = { top: 80, right: 20, bottom: 30, left: 40 },
    width = 394 - margin.left - margin.right,
    height = 750 - margin.top - margin.bottom;

    
    var dataCity = data.years

    xBar = d3.scaleBand()
        .range([0, width])
        .padding(0.1)
        .domain(dataCity.map(function(d) { return d.year; }));
    
    yBar = d3.scaleLinear()
        .range([height, 0])
        .domain([0, d3.max(dataCity, function(d) { return d.E33; })]);

    var svg = d3.select("#containerbar")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        
    g = svg.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    g.selectAll(".bar")
        .data(dataCity)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", function(d) { return xBar(d.year); })
        .attr("width", xBar.bandwidth())
        .attr("y", function(d) { return yBar(d.E33); })
        .attr("height", function(d) { return height - yBar(d.E33); });

    xAxis = d3.axisBottom(xBar)
        .tickFormat(d3.timeFormat("%Y"));

  // add the x Axis
  g.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
      .attr("class", "xaxis") ;

  // add the y Axis
  g.append("g")
      .call(d3.axisLeft(yBar))
      .attr("class", "yaxis") ;
}


function updateBar(data) {  
    console.log(data)
    
    var dataCity = data.years
    xBar.domain(dataCity.map(function(d) { return d.year; }));
    yBar.domain([0, d3.max(dataCity, function(d) { return d.E33; })]);

    var svg = d3.select("#containerbar")

    bars = svg.selectAll("rect")
        .data(dataCity);
        
    bars
        .enter()
        .append("rect"); 

    bars   
        .transition()
        .duration(300)
        .attr("x", function(d) { return xBar(d.year); })
        .attr("width", xBar.bandwidth())
        .attr("y", function(d) { return yBar(d.E33); })
        .attr("height", function(d) { return height - yBar(d.E33); });

    bars
        .exit()
        .remove()

    xAxis = d3.axisBottom(xBar)
        .tickFormat(d3.timeFormat("%Y"));

    svg.select(".xaxis")
        .transition()
        .call(xAxis)

    svg.select(".yaxis")
        .transition()
        .call(d3.axisLeft(yBar));



        
}