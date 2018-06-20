
function showMap() {
    var div = document.getElementById("mapbar");
    div.style.visibility = "visible";

    makeMap()
    dataBar('GM0363')
}  


function makeMap() { 
    if (window.loaded != true) {
        setTimeout(makeMap, 100);
    } else {
        var svgMap = d3.select(document.getElementById("svgmap").contentDocument);
        var svgItem = svgMap.select("#gemeentes");
        gemeentes = svgItem.selectAll("path");


        colorScale = d3.scaleLinear()
            .domain([1, 5])
            .interpolate(d3.interpolateHcl)
            .range([d3.rgb('#f7fbff'), d3.rgb('#4292c6')])
            .clamp(true);

        //loop through csv to assign each csv values to json region
        for (var i=0; i < dataMap.length; i++) {      
            var gemeenteData = dataMap[i]; //the current region
            var id = gemeenteData.CODE; //adm1 code
            
            //loop through json regions to find right region
            gemeentes.each(function (d, i) {

                selection = d3.select(this)
                //where adm1 codes match, attach csv to json object     
                if (selection.attr("id") == id){

                     // assign all five key/value pairs            
                    selection.attr("R2013", gemeenteData.R2013);                 
                    selection.attr("R2014", gemeenteData.R2014);
                    selection.attr("R2015", gemeenteData.R2015);
                    selection.attr("R2016", gemeenteData.R2016);
                    selection.attr("R2017", gemeenteData.R2017);
                    selection.attr("class", "gemeente");
                    selection.style("fill", colorScale(Math.round(parseFloat(selection.attr("R2017")))));

            
                      
                };
            });
        
        };
        
    gemeentes
        .style("stroke-width", "0.5")
        .on("click", getId)
        .on("mouseover", mouseOver)
        .on("mouseout", mouseOut);
    };   
}

function mouseOver(d) {  

    // Use D3 to select element, change color and size
    d3.select(this)
        .moveToFront()
        .style("stroke-width", "1.5");

    id = this.id

    d3.selectAll('circle')
        .filter(function(a) {
            return (id !== a.CODE);
        })
        .style('opacity', 0.4);

    d3.selectAll('circle')
        .filter(function(a) {
            return (id === a.CODE);
        })
        .attr("r", "12")
        .moveToFront()

    var circle = document.getElementById(id)

    if (circle != null) {
        var loc = circle.getBoundingClientRect()

        var dataTip = []    

        for (var i=0; i < dataPlot.length; i++) {
            if (dataPlot[i].CODE == id){
                dataTip = dataPlot[i];
                break
            }
        }
        console.log(dataPlot)
        console.log(loc)

        return tooltip
            .style("visibility", "visible")
            .html("<p><b>" + dataTip.CITY + "</p><p style='font-size:14px;'>" + dataTip.E33.toFixed(2) + "</b> E33-meldingen per 1000 inwoners<br><b>&euro; " + dataTip.GGZ.toFixed(2) + "</b> kosten GGZ per verzekerde</p>")
            .style("left", loc.x - 280 +"px")
            .style("top", loc.y + window.scrollY +"px");
    }


        
}

function mouseOut(d) {
    // Use D3 to select element, change color back to normal

    d3.select(this)
        .style("stroke-width", "0.5");

    d3.selectAll('circle')
        .style('opacity', 1)
        .attr("r", "3");
    
    return tooltip
            .style("visibility", "hidden")
}

function getId(d, i) {  
    // Use D3 to select element, change color and size
    
    var year = document.getElementById("myRange").value
    gemeentes.each(function (d, i) {
            selection = d3.select(this)   
            selection.style("fill", colorScale(Math.round(parseFloat(selection.attr("R"+year)))));
    });

    d3.select(this)
        .style("fill", "rgb(2,129,138)");

    gemeente = d3.select(this).attr('id')

    dataBar(gemeente)            
}

/*
* Updates the map when slider is changed.
*/
function updateMap(year) {
    // updates the current yearabove the map
    d3.select("#slideroutput").html(year);

        gemeentes.each(function (d, i) {
            selection = d3.select(this)   
            selection.style("fill", colorScale(Math.round(parseFloat(selection.attr("R"+year)))));

    
              
        });
    
};


