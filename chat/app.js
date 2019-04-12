const express = require("express");
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

app.use(express.static('static'));

io.on("connect", function(socket) {
	console.log("connected")
	socket.on('send', function(d) {
		socket.broadcast.emit("rcv", {message: d.message})
	});
	socket.on("command", function(d) {
		socket.broadcast.emit("commando", {command: d.message});
	})

	console.log(io.clients())
});

app.get('/', function(req, res) {
	res.sendFile('index.html');
});

server.listen(1000, function() {
	console.log("Server running on default Port: 80")
});