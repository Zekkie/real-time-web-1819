const stdin = process.stdin;
const io = require("socket.io-client");
const readline = require('readline');
const util = require('util');
const socket = io.connect('http://127.0.0.1:1000')
const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
})

rl.prompt(true)



rl.on('line', function(l) {
	socket.emit('command',{message: l})
	rl.prompt(true)
})


socket.on("commando", (d) => {
	console.log('\x1b[33m%s\x1b[0m',d.command)
	rl.prompt(true)
})