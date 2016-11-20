var http = require('http');
var fs = require('fs');
var sleep = require('sleep-async')();

There should be an error at line 5, it's just a reminder to set your file paths'
var FILE_PATH = '*******************************/flightpath.txt';
var HTML_FILE_PATH = '***************/index.html';
var lines_fp = 7;
var file_data = "none";
var f_sep = '';
var n_waypoints = -1;
var web_content = "";

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
	
	new_attack.attack_zone = "var attackcircle = \"\"; \nfunction onMapClick(e){\nmap.removeLayer(attackcircle);\nattackcircle = L.circle([e.latlng.lat, e.latlng.lng], {color: \'red\', fillColor: \'#f03\', fillOpacity: 0.5, radius: " + new_attack.attack_radius +"}).addTo(map);\n} map.on(\'click\', onMapClick);\n"
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

fs.readFile(HTML_FILE_PATH, function read(err1, data1) {
	if(err1){
		console.log(err1);
	}
	web_content = data1.toString();

	//console.log(web_content);
});

http.createServer(function (req, res) {
	sleep.sleep(4000, function(){
	  var cent_lat = getLatitudeForLine(1, f_sep);
		var cent_lon = getLongtitudeForLine(1, f_sep);
		var lat_arr = [];
		var lon_arr = [];
		var markers = [];
		for (var i = 1; i < n_waypoints + 1; i+=1) {
			lat_arr.push(getLatitudeForLine(i, f_sep));
			lon_arr.push(getLongtitudeForLine(i, f_sep));
		}
		for (var i = 1; i < n_waypoints + 1; i+=1) {
			markers.push("var marker"+i+"= L.marker(["+lat_arr[i - 1]+","+ lon_arr[i - 1]+"]).addTo(map);"+"marker"+i+".bindPopup("+"\"Waypoint "+i+"\").openPopup(); var l"+i+"= new L.LatLng("+lat_arr[i]+","+lon_arr[i]+"); var l"+(i+1)+"= new L.LatLng("+lat_arr[i + 1]+", "+lon_arr[i + 1]+"); var line_points"+i+"=[l"+i+", l"+(i+1)+"]; var line"+i+"= L.polygon(line_points"+i+").addTo(map);");
		}
		console.log("markers");
		res.writeHead(200, {"Content-Type": "text/html"});
		var split_part = "var map = L.map(\'map\',{center: ["+cent_lat+", "+cent_lon+"],zoom: 15});\nL.tileLayer(\'http://{s}.tile.osm.org/{z}/{x}/{y}.png\', {attribution: \'&copy; <a href=\"http://osm.org/copyright\">OpenStreetMap</a> contributors\', maxZoom: 25}).addTo(map);\n"
		res.write(web_content + split_part + new_attack.attack_zone + markers.join('') + "</script></body></html>");
		console.log(web_content + split_part + new_attack.attack_zone + markers.join('') + "</script></body></html>");
		//console.log("<!DOCTYPE html><html><head><title>FP Plotter</title><link rel=\"stylesheet\" href=\"https://unpkg.com/leaflet@1.0.1/dist/leaflet.css\" /><script src=\"https://unpkg.com/leaflet@1.0.1/dist/leaflet.js\"></script></script><style>#map {width: 960px;height:500px;}</style></head><body><div id=\"map\"></div><script>var map = L.map('map',{center: ["+cent_lat+", "+cent_lon+"],zoom: 15});L.tileLayer(\'http://{s}.tile.osm.org/{z}/{x}/{y}.png\', {attribution: \'&copy; <a href=\"http://osm.org/copyright\">OpenStreetMap</a> contributors\'}).addTo(map);" +new_attack.attack + markers.join('') +"</script></body></html>");
	});
}).listen(8070);
