
var P4C = require("pic4carto");
var fs = require('fs');
var request = require('request');
var directory = 'img/'
global.XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
global.XMLHttpRequest.DONE = 4;

var picManager = new P4C.PicturesManager();

/*
uri : download uri
filename : output filename 
callback : what to call after
*/
var download = function (uri, filename, callback) {
	request.head(uri, function (err, res, body) {
		request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
	});
};

/*
filename : file to load (JSON)
*/
var loadFile = function (filename) {
	var contents = fs.readFileSync(filename);
	// Define to JSON type
	var jsonContent = JSON.parse(contents);
}


var main = function () {
	var input = loadFile("input.json");

	for (var i = 0; i < input.intersections.length; i++) {
		for (var j = 0; j < input.intersections[i].direction.length; j++) {
			picManager.startPicsRetrievalAround(new P4C.LatLng(input.intersections[i].direction[j].lat, input.intersections[i].direction[j].long), 15, { mindate: 0, towardscenter: true })
				.then(function (pictures) {
					for (var i = 0; i < pictures.length; i++) {
						var pic = pictures[i];
						download(pic.pictureUrl, directory + i + '.jpg', function () {
							console.log('Downloaded');
						});
						console.log(pic.coordinates);
						console.log(pic.direction);
					}
				});
		}
	}




