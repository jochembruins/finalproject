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
	var dataMap = 'data/dataMap.json';

	// request both datafiles and wait till both loaded
	queue(3)
		.defer(d3.json, dataE33)
		.defer(d3.json, dataMedia)
		.defer(d3.json, dataMap)
		.awaitAll(prepData);
};

d3.selection.prototype.moveToFront = function() {
  return this.each(function(){
  this.parentNode.appendChild(this);
  });
};
