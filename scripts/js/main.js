/*
* main.js
*
* Jochem Bruins - 10578811
*
* Laadt de data en verschillende grafieken voor index.html
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

	// request both datafiles and wait till both loaded
	queue(2)
		.defer(d3.json, dataE33)
		.defer(d3.json, dataMedia)
		.awaitAll(prepData);
};