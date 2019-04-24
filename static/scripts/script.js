const socket = io.connect(window.location.origin); 

const register = [];


function constructChart(d) {
	const width = 800,
	height = 500;



	const svg = d3.select("body")
		.append("svg")
		.attr("width", width)
		.attr("height", height);

	const y = d3.scaleLinear().range([height - 200,0]);
	const x = d3.scaleLinear().range([0, width - 200]);

	y.domain(d3.extent(d,(d) => {
		return d.avg;
	}));

	x.domain(d3.extent(d,d => {
		return d.hour;
	}));

	//x.domain()

	const line = d3.line()
		.x(function(d) {
			return x(d.hour);
		})
		.y(function(d) {
			return y(d.avg);
		});



	const yAxis = d3.axisLeft(y).ticks(5)
	const xAxis = d3.axisBottom(x).ticks(15);

	svg.append("g")
		.attr("class","y-axis")
		.style("transform", "translate(40px,20px)")
		.call(yAxis);

	svg.append("g")
		.attr("class","x-axis")
		.style("transform", "translate(40px,"+(height-180)+"px)")
		.call(xAxis);

	svg.append("path")
		.attr("class","line")
		.style("transform", "translate(40px,20px)")
		.attr("d", line(d));

	function getRandomInt(min, max) {
	    min = Math.ceil(min);
	    max = Math.floor(max);
	    return Math.floor(Math.random() * (max - min + 1)) + min;
	}
}


class NS{
	constructor(name) {
		this.name = name;
		this.ns = io.connect(window.location.origin+"/"+name)
		this.ns.on("avg", (d) => {
			console.log(d)
			constructChart(d.array);
		})

	};
}

function clickHandler() {
	if(!register.find((i) => {
		return i.name === this.name
	})) {
		register.push(new NS(this.name));
	}else {
		console.log("dupe",register)
	}	
};

function createNameButtons(n) {
	const container = document.querySelector("#available-names");
	if(container.children.length < 1) {
		for(let name of n) {
			const button = document.createElement("button");
			button.innerHTML = name;
			button.name = name;
			button.onclick = clickHandler;
			container.appendChild(button);
		}
	}
}


socket.on("names", createNameButtons);
