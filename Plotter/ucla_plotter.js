var http = require('http');
var fs = require('fs');
var sleep = require('sleep-async')();

var FILE_PATH = './flightpath.txt';

var lines_fp = 7;
var file_data = "none";
var f_sep = '';
var n_waypoints = -1;

var attack = {
	attack_radius: "",
	attack_zone: "",
	attack_lat: "",
	attack_lon: ""
};

var new_attack = Object.create(attack);

function getLatitudeForLine(line, f__sep) {
	var sep_tab = f__sep[line].split('\t');
	return sep_tab[8];
}

function getLongtitudeForLine(line, f__sep) {
	var sep_tab = f__sep[line].split('\t');
	return sep_tab[9];
}

process.argv.forEach(function (val, index, array) {
	if(index === 2){
		n_waypoints = parseInt(val);
 	}
	else if (index === 3){
		new_attack.attack_radius = val;
	}
	else if (index === 4) {
		//lat
		new_attack.attack_lat = val;
	}else if (index === 5) {
		new_attack.attack_lon = val;
	}

	new_attack.attack_zone = "var c = L.circle(["+new_attack.attack_lat	+", "+new_attack.attack_lon+"], {color: \'red\',fillColor: \'#f03\',fillOpacity: 0.5,radius: "+ 	new_attack.attack_radius+"}).addTo(map);";
	console.log(new_attack.attack_zone);
});

fs.readFile(FILE_PATH, function read(err, data) {
	if(err){
		console.log(err);
	}
	var f_content = data;
	f_sep = data.toString().split('\n')
	console.log(getLatitudeForLine(1, f_sep));
	console.log(getLongtitudeForLine(1, f_sep));
	console.log("server starting...");
});

http.createServer(function (req, res) {
	sleep.sleep(4000, function(){
	  var cent_lat = getLatitudeForLine(1, f_sep);
		var cent_lon = getLongtitudeForLine(1, f_sep);
		var lat_arr = [];
		var lon_arr = [];
		var markers = [];
		for (var i = 1; i < n_waypoints; i+=1) {
			lat_arr.push(getLatitudeForLine(i, f_sep));
			lon_arr.push(getLongtitudeForLine(i, f_sep));
		}
		for (var i = 1; i < n_waypoints; i+=1) {
			markers.push("var marker"+i+"= L.marker(["+lat_arr[i]+","+ lon_arr[i]					+"]).addTo(map);"+"marker"+i+".bindPopup("+"\"Waypoint "+i+"\").openPopup();");
		}
		console.log("markers");
		res.writeHead(200, {"Content-Type": "text/html"});
		res.write("<!DOCTYPE html><html><head><title>FP Plotter</title><link rel=\"stylesheet\" href=\"https://unpkg.com/leaflet@1.0.1/dist/leaflet.css\" /><script src=\"https://unpkg.com/leaflet@1.0.1/dist/leaflet.js\"></script></script><style>#map {width: 960px;height:500px;}</style></head><body><div id=\"map\"></div><script>var map = L.map('map',{center: ["+cent_lat+", "+cent_lon+"],zoom: 15});L.tileLayer(\'http://{s}.tile.osm.org/{z}/{x}/{y}.png\', {attribution: \'&copy; <a href=\"http://osm.org/copyright\">OpenStreetMap</a> contributors\'}).addTo(map);" +new_attack.attack_zone + markers.join('') +"</script></body></html>");
		console.log("<!DOCTYPE html><html><head><title>FP Plotter</title><link rel=\"stylesheet\" href=\"https://unpkg.com/leaflet@1.0.1/dist/leaflet.css\" /><script src=\"https://unpkg.com/leaflet@1.0.1/dist/leaflet.js\"></script></script><style>#map {width: 960px;height:500px;}</style></head><body><div id=\"map\"></div><script>var map = L.map('map',{center: ["+cent_lat+", "+cent_lon+"],zoom: 15});L.tileLayer(\'http://{s}.tile.osm.org/{z}/{x}/{y}.png\', {attribution: \'&copy; <a href=\"http://osm.org/copyright\">OpenStreetMap</a> contributors\'}).addTo(map);" +new_attack.attack + markers.join('') +"</script></body></html>");
	});
}).listen(8070);
