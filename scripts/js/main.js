/*
 * main.js
 *
 * Jochem Bruins - 10578811
 *
 * Loads the data and prepares this for the charts at index.html
 */

/*
 * Does these functions while loading the page.
 */
window.onload = function() {
    getData();
};


/*
 * Requests the data from own server.
 */
function getData() {
    // path to files
    var dataE33 = 'data/dataE33.json';
    var dataMedia = 'data/dataMedia.json';
    var dataMap = 'data/dataMap.json';
    var dataPlot = 'data/dataPlot.json';

    // request all datafiles and wait till all retrieved
    queue(4)
        .defer(d3.json, dataE33)
        .defer(d3.json, dataMedia)
        .defer(d3.json, dataMap)
        .defer(d3.json, dataPlot)
        .awaitAll(prepData);
};


/*
 * Gets the data from requested files.
 */
function prepData(error, response) {
    dataE33 = response[0].data;
    dataMedia = response[1].data;
    dataMap = response[2].data;
    dataPlot = response[3].data;

    prepCombi(dataMedia, dataE33);
};


/*
 * Selects an svg element and moves it to the front.
 * Function from https://gist.github.com/johsh/9629458 
 */
d3.selection.prototype.moveToFront = function() {
    return this.each(function() {
        this.parentNode.appendChild(this);
    });
};