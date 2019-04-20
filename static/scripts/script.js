const socket = io.connect(window.location.origin)


const nameContainer = document.getElementById("available-names");

class NS{
	constructor(name) {
		this.data = []
	  this.name = name;
	  this.socket = io.connect(window.location.origin+"/"+this.name);
	  this.socket.on("data",(d) => {
	  	this.data.push(d);
	  	this.updateCount();
	  })



	  this.createContainer(this.name);
	  this.count = document.querySelector("#"+this.name).querySelector("p");

	  console.log(this.count);
	}


	createContainer(name) {
		const nameWrapper = document.createElement("div");
		nameWrapper.setAttribute("id", name);
		const nameP = document.createElement("p");
		nameP.innerHTML = name;
		const count = document.createElement("p");
		count.innerHTML = this.data.length;

		nameWrapper.appendChild(count);
		nameWrapper.appendChild(nameP);
		nameContainer.appendChild(nameWrapper);
	}

	updateCount() {
		this.count.innerHTML = this.data.length;
	}

}

const names = [];

socket.on("data", (d) => {

	
	for(let i = 0; i < d.length; i++) {
		names.push(new NS(d[i]));
	};
});