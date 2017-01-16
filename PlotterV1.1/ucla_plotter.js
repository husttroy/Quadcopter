var http = require('http');
var fs = require('fs');
var sleep = require('sleep-async')();

var ORIGINAL_FP_PATH = './working_path.txt';
var FIX_FP_PATH = './working_path.txt';

var f_sep_original = '';
var f_sep_fix = '';
var n_waypoints_1 = -1;
var n_waypoints_2 = -1;

var global_html_content = "";

var attack = {
	attack_radius: "",
	attack_zone: "",
	attack_lat: "",
	attack_lon: ""
};

var new_attack = Object.create(attack);
var new_attack2 = Object.create(attack);

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
		n_waypoints_1 = parseInt(val);
 	}else if(index === 3){
 		n_waypoints_2 = parseInt(val);
 	}
	else if (index === 4){
		new_attack.attack_radius = val;
	}
	
});

fs.readFile(ORIGINAL_FP_PATH, function read(err, data) {
	if(err){
		console.log(err);
	}
	var f_content = data;
	f_sep_original = data.toString().split('\n');
	console.log("Read ORIGINAL_FP_PATH");
});

fs.readFile(FIX_FP_PATH, function read(err, data) {
	if(err){
		console.log(err);
	}
	var f_content = data;
	f_sep_fix = data.toString().split('\n');
	console.log("Read fixed fp path");
});

fs.readFile("./index.html", function read(err, data){
	if(err){
		console.log(err);
	}
	var html_content = data.toString(); //local to this function
	html_content = html_content.replace("circle_rad_var_goes_here", "var circle_rad = " + new_attack.attack_radius + ";");
	global_html_content = html_content;
});

http.createServer(function (req, res) {
		console.log("Started server")
	  	var cent_lat = getLatitudeForLine(1, f_sep_original);
		var cent_lon = getLongtitudeForLine(1, f_sep_original);

		var lat_arr = [];
		var lon_arr = [];
		var lat_arr2 = [];
		var lon_arr2 = [];
		var markers = [];
		var markers2 = [];

		console.log(new_attack.attack_radius)
		for (var i = 1; i < n_waypoints_1 + 1; i+=1) {
			if(f_sep_original[i].split('\t')[3] == 16){
				lat_arr.push(getLatitudeForLine(i, f_sep_original));
				lon_arr.push(getLongtitudeForLine(i, f_sep_original));
				console.log(i);
			}
		}
		for (var i = 1; i < n_waypoints_1 + 1; i+=1) {
			if(f_sep_original[i].split('\t')[3] == 16){
				markers.push("\nvar marker"+i+"= L.marker(["+lat_arr[i - 1]+","+ lon_arr[i - 1]+"]).addTo(m1);\n"+"marker"+i+".bindPopup("+"\"Waypoint "+i+"\").openPopup();\n var l"+i+"= new L.LatLng("+lat_arr[i]+","+lon_arr[i]+");\n var l"+(i+1)+"= new L.LatLng("+lat_arr[i + 1]+", "+lon_arr[i + 1]+"); \nvar line_points"+i+"=[l"+i+", l"+(i+1)+"]; \nvar line"+i+"= L.polygon(line_points"+i+").addTo(m1);\n");
			}
		}
		for (var i = 1; i < n_waypoints_2 + 1; i+=1) {
			if(f_sep_fix[i].split('\t')[3] == 16){
				lat_arr2.push(getLatitudeForLine(i, f_sep_fix));
				lon_arr2.push(getLongtitudeForLine(i, f_sep_fix));
			}
		}

		for (var i = 1; i < n_waypoints_2 + 1; i+=1) {
			if(f_sep_original[i].split('\t')[3] == 16){
				//console.log("add marker\n"+ lat_arr[i - 1] + "  " + lon_arr[i - 1]);
				markers2.push("\nvar marker2_"+i+"= L.marker(["+lat_arr2[i - 1]+","+ lon_arr2[i - 1]+"]).addTo(m2);\n"+"marker2_"+i+".bindPopup("+"\"Waypoint "+i+"\").openPopup();\n var l2"+i+"= new L.LatLng("+lat_arr2[i]+","+lon_arr2[i]+");\n var l2"+(i+1)+"= new L.LatLng("+lat_arr2[i + 1]+", "+lon_arr2[i + 1]+");\n var line_points2"+i+"=[l"+i+", l"+(i+1)+"]; \nvar line2_"+i+"= L.polygon(line_points"+i+").addTo(m2);\n");
			}
		}
		console.log("Added markers to arrays")

		global_html_content = global_html_content.replace("waypoints_go_here", markers.join("") + markers2.join(""));

		console.log("Adding objects...")
		res.writeHead(200, {"Content-Type": "text/html"});

		res.write(global_html_content);
		res.end();
}).listen(8070);