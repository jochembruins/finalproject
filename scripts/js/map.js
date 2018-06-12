
function showMap() {
    var div = document.getElementById("svgContainer");
    div.style.visibility = "visible";

    makeMap()
    dataBar('GM0363')
}  


function makeMap() { 

    var svg = d3.select(document.getElementById("svgmap").contentDocument);
    var svgItem = svg.select("#gemeentes");
    console.log(svgItem)
    gemeentes = svgItem.selectAll("path");
    gemeentesJs = gemeentes._groups[0]

    colorScale = d3.scaleLinear()
        .domain([d3.min(dataMap, function(d) { 
            return parseFloat(d.R2017); 
        }), 5,  
        d3.max(dataMap, function(d) { 
            return parseFloat(d.R2017); 
        })])
        .interpolate(d3.interpolateHcl)
        .range([d3.rgb('#4575b4'), d3.rgb('#ffffbf'), d3.rgb('#d73027')]);

    //loop through csv to assign each csv values to json region
    for (var i=0; i < dataMap.length; i++) {      
        var gemeenteData = dataMap[i]; //the current region
        var id = gemeenteData.CODE; //adm1 code
        

        //loop through json regions to find right region
        for (var j = 0; j < gemeentesJs.length; j++){
            //where adm1 codes match, attach csv to json object     
            if (gemeentesJs[j].id == id){
                console.log('hallo')
                      
                 // assign all five key/value pairs            
                  gemeentesJs[j]['2013'] = gemeenteData.R2013;                  
                  gemeentesJs[j]['2014'] = gemeenteData.R2014;
                  gemeentesJs[j]['2015'] = gemeenteData.R2015;
                  gemeentesJs[j]['2016'] = gemeenteData.R2016;
                  gemeentesJs[j]['2017'] = gemeenteData.R2017;
                  gemeentesJs[j].setAttribute("class", "gemeente");
                  gemeentesJs[j].style.fill = colorScale(Math.round(parseFloat(gemeentesJs[j]['2017'])));

        
                  break; //stop looking through the json regions
            };
        };
    
    };
    
    gemeentes
        .style("stroke-width", "0.5")
        .on("click", getId)
        .on("mouseover", mouseOver)
        .on("mouseout", mouseOut);
    
}

function mouseOver(d, i) {  

    // Use D3 to select element, change color and size
    d3.select(this)
        .moveToFront()
        .style("stroke-width", "1.5");
        
}

function mouseOut(d, i) {
    // Use D3 to select element, change color back to normal
    d3.select(this)
        .style("stroke-width", "0.5");
        
}

function getId(d, i) {  
    // Use D3 to select element, change color and size
    gemeente = d3.select(this).attr('id')

    dataBar(gemeente)        
        
}


