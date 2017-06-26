var http = require('http');
var fs = require('fs');

var content = "";

fs.readFile("./plotter.html", function read(err, data){
	if(err){
		console.log(err);
	}
	content = data.toString();
});

console.log("Started server on port 8070")

http.createServer(function (req, res) {
		res.writeHead(200, {"Content-Type": "text/html"});
		res.write(content);
		res.end();
}).listen(8070);
