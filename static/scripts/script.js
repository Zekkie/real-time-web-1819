const socket = io.connect(window.location.origin)




socket.on("data", (d) => {
	
	console.log(d)
});