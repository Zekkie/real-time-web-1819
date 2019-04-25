const NewAvarage = require("./getAvg.js");

class Observer {
	constructor(props) {
	  this.observers = []
	}

	subscribe(namespace) {
		this.observers.push(namespace);
	}

	update(data) {
		for(let i = 0; i < this.observers.length; i++) {
			if(data.mentions.includes(this.observers[i].name)) {
				const conn = new NewAvarage(this.observers[i].name);
				conn.onNew((a) => {
					//console.log(this.observers[i].name + " has new data")
					this.observers[i].emit({name:this.observers[i].name,values:a});
					
				})
				
				//console.log("data for: " + this.observers[i].name);
			
			};
		};
	};
};

module.exports = Observer;