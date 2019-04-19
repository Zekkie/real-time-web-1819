const socket = io.connect(window.location.origin+"/sansa")




socket.on("data", (d) => {
	
	console.log(d)
});