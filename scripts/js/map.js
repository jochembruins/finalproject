function showMap() {
    var div = document.getElementById("svgContainer");
    div.style.visibility = "visible";

    makeMap()
}  


function makeMap() { 

    var svg = document.getElementById("svgmap");
    var svgDoc = svg.contentDocument;
    var svgItem = svgDoc.getElementById("gemeentes");
    console.log(svgItem)
    gemeentes = svgItem.getElementsByTagName('path');
    console.log(gemeentes[0])

    //loop through csv to assign each csv values to json region
    for (var i=0; i < dataMap.length; i++) {      
        var gemeenteData = dataMap[i]; //the current region
        var id = gemeenteData.CODE; //adm1 code

        //loop through json regions to find right region
        for (var j = 0; j < gemeentes.length; j++){
            //where adm1 codes match, attach csv to json object     
            if (gemeentes[j].id == id){

                      
                 // assign a§ll five key/value pairs            
                  gemeentes[j]['2013'] = gemeenteData.R2013;                  
                  gemeentes[j]['2014'] = gemeenteData.R2014;
                  gemeentes[j]['2015'] = gemeenteData.R2015;
                  gemeentes[j]['2016'] = gemeenteData.R2016;
                  gemeentes[j]['2017'] = gemeenteData.R2017;
        
                  break; //stop looking through the json regions
            };
        };
    };
    console.log(Math.round(parseFloat(gemeentes[0]['2013'])));

    colorScale = d3.scaleLinear()
        .domain([d3.min(dataMap, function(d) { 
            return parseFloat(d.R2017); 
        }), 5,  
        d3.max(dataMap, function(d) { 
            return parseFloat(d.R2017); 
        })])
        .interpolate(d3.interpolateHcl)
        .range([d3.rgb('#4575b4'), d3.rgb('#ffffbf'), d3.rgb('#d73027')]);

    for (var k = 0; k < gemeentes.length; k++) {
        console.log(Number(gemeentes[k]['2017']))
        gemeentes[k].style.fill = colorScale(Math.round(parseFloat(gemeentes[k]['2017'])));      
    }
}
        

