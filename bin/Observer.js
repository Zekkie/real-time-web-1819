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
				//observers[i].emit("data", data);
				console.log(data.mentions, "from observer to: " + this.observers[i].name)
			};
		};
	};
};

module.exports = Observer;