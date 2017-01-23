var http = require('http');
var fs = require('fs');
var sleep = require('sleep-async')();

var ORIGINAL_FP_PATH = './working_path.txt';
var FIX_FP_PATH = './working_path.txt';

var f_sep_original = '';
var f_sep_fix = '';
var n_waypoints_1 = 0;
var n_waypoints_2 = 0;

var global_html_content = "";

var save_waypoint_lat_1 = [];
var save_waypoint_lat_2 = [];
var save_waypoint_lon_1 = [];
var save_waypoint_lon_2 = [];

var attack = {
	attack_radius: "",
	attack_zone: "",
	attack_lat: "",
	attack_lon: ""
};

var new_attack = Object.create(attack);

function getLatitudeForLine(line, f__sep) {
	var sep_tab = f__sep[line].split("\t");
	return sep_tab[8];
}

function getLongtitudeForLine(line, f__sep) {
	var sep_tab = f__sep[line].split("\t");
	return sep_tab[9];
}

process.argv.forEach(function (val, index, array) {
	if (index === 2){
		new_attack.attack_radius = val;
	}
	
});

fs.readFile(ORIGINAL_FP_PATH, function read(err, data) {
	if(err){
		console.log(err);
	}
	var f_content = data;
	f_sep_original = data.toString().split('\n');
	//get number of waypoints
	for(var i = 0; i < f_sep_original.length; i += 1){
		if(f_sep_original[i].split("\t")[3] != undefined){
			if(f_sep_original[i].split("\t")[3] === "16"){
				n_waypoints_1 += 1;
				save_waypoint_lat_1.push(f_sep_original[i].split("\t")[8]);
				save_waypoint_lon_1.push(f_sep_original[i].split("\t")[9]);
			}
		}
	}
	console.log("Read ORIGINAL_FP_PATH; # waypoints=", n_waypoints_1.toString(), "\n");
});

fs.readFile(FIX_FP_PATH, function read(err, data) {
	if(err){
		console.log(err);
	}
	var f_content = data;
	f_sep_fix = data.toString().split('\n');
	for(var i = 0; i < f_sep_fix.length; i += 1){
		if(f_sep_fix[i].split("\t")[3] != undefined){
			if(f_sep_fix[i].split("\t")[3] === "16"){
				n_waypoints_2 += 1;
				console.log(f_sep_fix[i].split("\t")[0]);
				save_waypoint_lat_2.push(f_sep_fix[i].split("\t")[8]);
				save_waypoint_lon_2.push(f_sep_fix[i].split("\t")[9]);
			}
		}
	}
	console.log("Read fixed fp path; # waypoints = ", n_waypoints_2.toString(), "\n");
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

		var lat_arr = [];
		var lon_arr = [];
		var lat_arr2 = [];
		var lon_arr2 = [];
		var markers = [];
		var markers2 = [];

		console.log(new_attack.attack_radius);
		/*
		for (var i = 1; i < n_waypoints_1 + 1; i+=1) {
			if(f_sep_original[i].split('\t')[3] == "16"){
				markers.push("\nvar marker"+i+"= L.marker(["+lat_arr[i - 1]+","+ lon_arr[i - 1]+"]).addTo(m1);\n"+"marker"+i+".bindPopup("+"\"Waypoint "+i+"\").openPopup();\n var l"+i+"= new L.LatLng("+lat_arr[i]+","+lon_arr[i]+");\n var l"+(i+1)+"= new L.LatLng("+lat_arr[i + 1]+", "+lon_arr[i + 1]+"); \nvar line_points"+i+"=[l"+i+", l"+(i+1)+"]; \nvar line"+i+"= L.polygon(line_points"+i+").addTo(m1);\n");
			}
		}
		

		for (var i = 1; i < n_waypoints_2 + 1; i+=1) {
			if(f_sep_fix[i].split('\t')[3] == "16"){
				markers2.push(" var l2"+i+"= new L.LatLng("+lat_arr2[i]+","+lon_arr2[i]+");\n var l2"+(i+1)+"= new L.LatLng("+lat_arr2[i + 1]+", "+lon_arr2[i + 1]+");\n var line_points2"+i+"=[l2"+i+", l2"+(i+1)+"]; \nvar line2_"+i+"= L.polygon(line_points2"+i+").addTo(m2);\n");
			}
		}
		*/
		var cent_lat = save_waypoint_lat_1[0];
		var cent_lon = save_waypoint_lon_1[0];

		for (var i = 0; i < n_waypoints_1; i++) {
			var marker_tmp = "var marker" + i.toString() + " = new L.marker([" + save_waypoint_lat_1[i] + ", " + save_waypoint_lon_1[i] + "]).addTo(m1);\n";
			var bind_popup = "marker" + i.toString() + ".bindPopup(\"Waypoint " + i + "\").openPopup();\n"
			var point1 = "var point_1_" + i.toString() + " = new L.LatLng(" + save_waypoint_lat_1[i] + ", " + save_waypoint_lon_1[i] + ");\n";
			var point2 = undefined;
			if(i === n_waypoints_1 - 1){
				var point2 = "var point_2_" + i.toString() + " = new L.LatLng(" + save_waypoint_lat_1[0] + ", " + save_waypoint_lon_1[0] + ");\n"; 
			}else{
				var point2 = "var point_2_" + i.toString() + " = new L.LatLng(" + save_waypoint_lat_1[i + 1] + ", " + save_waypoint_lon_1[i + 1] + ");\n"; 
			}	

			var line = "var line" + i + " = new L.polygon([point_1_" + i.toString() + ", point_2_" + i.toString() + "]).addTo(m1);\n"
			markers.push(marker_tmp + bind_popup + point1 + point2 +line)
		}

		for (var i = 0; i < n_waypoints_2; i++) {
			var marker_tmp = "var marker2_" + i.toString() + " = new L.marker([" + save_waypoint_lat_2[i] + ", " + save_waypoint_lon_2[i] + "]).addTo(m2);\n";
			var bind_popup = "marker2_" + i.toString() + ".bindPopup(\"Waypoint " + i + "\").openPopup();\n"
			var point1 = "var point2_1_" + i.toString() + " = new L.LatLng(" + save_waypoint_lat_2[i] + ", " + save_waypoint_lon_2[i] + ");\n";
			var point2 = undefined;
			if(i === n_waypoints_1 - 1){
				var point2 = "var point2_2_" + i.toString() + " = new L.LatLng(" + save_waypoint_lat_2[0] + ", " + save_waypoint_lon_2[0] + ");\n"; 
			}else{
				var point2 = "var point2_2_" + i.toString() + " = new L.LatLng(" + save_waypoint_lat_2[i + 1] + ", " + save_waypoint_lon_2[i + 1] + ");\n"; 
			}	

			var line = "var line2_" + i + " = new L.polygon([point2_1_" + i.toString() + ", point2_2_" + i.toString() + "]).addTo(m2);\n"

			markers2.push(marker_tmp + bind_popup + point1 + point2 + line)
		}
			//add markers

		console.log(save_waypoint_lon_1.join("\n"))
		console.log(save_waypoint_lon_2.join("\n"))

		console.log("Added markers to arrays")

		global_html_content = global_html_content.replace("waypoints_go_here", markers.join("") + markers2.join(""));
		global_html_content = global_html_content.replace("CENT_LAT1", cent_lat.toString())
		global_html_content = global_html_content.replace("CENT_LAT2", cent_lat.toString())

		global_html_content = global_html_content.replace("CENT_LON1", cent_lat.toString())
		global_html_content = global_html_content.replace("CENT_LON2", cent_lat.toString())

		console.log("Adding objects...")
		res.writeHead(200, {"Content-Type": "text/html"});

		res.write(global_html_content);
		//res.write("Hello")
		res.end();
}).listen(8070);