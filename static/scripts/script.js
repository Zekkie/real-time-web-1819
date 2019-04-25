const socket = io.connect(window.location.origin); 

const register = [];

const data = [];


//D3JS CHART GENERATOR

function getMinMax(d) {
	
}



class Chart{
	constructor() {
		this.height = 500;
		this.width = 800;
		this.scaleY = d3.scaleLinear().range([0,this.height-180]);
		this.scaleX = d3.scaleLinear().range([0,this.width]);
		this.yAxis = d3.axisLeft(this.scaleY);
		this.xAxis = d3.axisBottom(this.scaleX);

	}

	createLegend(n,c) {
		const legend = d3.select("#legend");

		legend
			.append("div")
			.attr("class","legend legend-"+n)
				.append("div")
				.style("background-color", c)
				.append("div")
				.text(n)

		const item = d3.select(".legend-"+n);
		item.on("mouseover", function(){
			const lines = document.querySelectorAll(".line");
			for(let i = 0; i < lines.length;i++) {
				const classes = Array.from(lines[i].classList);
				if(!classes.includes("line-"+n)) {
					lines[i].classList.add("fade");
				}
			}
		})
		.on("mouseout", function(){
			const lines = document.querySelectorAll(".line");
				for(let i = 0; i < lines.length;i++) {
					lines[i].classList.remove("fade");
				}
		})
	}

	getMinMaxY(d) {
		const values = [];
		for(let i = 0; i < d.length; i++) {
			for(let j = 0; j < d[i].values.length; j++) {
				values.push(d[i].values[j].avg);
			};
		};
		return d3.extent(values);
	}

	getMinMaxX(d) {
		const values = [];
		for(let i = 0; i < d.length; i++) {
			for(let j = 0; j < d[i].values.length; j++) {
				values.push(d[i].values[j].hour);
			};
		};
		return d3.extent(values);
	}

	constructLine(d) {
		console.log("construct")
		const svg = d3.select("svg");
		const line = d3.line().x(function(d) {
			return this.scaleX(d.hour);
			}.bind(this)).y(function(d) {
			return this.scaleY(d.avg);
			}.bind(this));
			
			const randColor = "hsl(" + Math.random() * 360 + ",100%,50%)";
			  
			this.createLegend(d.name,randColor);
			svg.append("path")
				.attr("class",["line line-"+d.name])
				.style("transform", "translate(50px,20px)")
				.style("stroke",randColor)
				.attr("d", line(d.values.map((i) => {
					return i
				})))
	


	};

	updateLine() {
		const line = d3.line().x(function(d) {
			return this.scaleX(d.hour);
			}.bind(this)).y(function(d) {
			return this.scaleY(d.avg);
			}.bind(this));

		return line;

	}

	constructChart(d) {
		const minMaxY = this.getMinMaxY(d);
		const minMaxX = this.getMinMaxX(d);
		let y = this.scaleY.domain([10,-10]);
		let x = this.scaleX.domain([0,23]);
		const svg = d3.select("body")
			.append("svg")
			.attr("width",this.width)
			.attr("height",this.height);

		svg.append("text").text("Hours")
			.style("transform","translate("+(this.width/2)+"px,"+(this.width/2)+"px)")

		svg.append("text").text("Sentiment")
			.style("transform","rotate(-90deg)")
			.attr("x",-220)
			.attr("y",20)
		svg.append("g")
			.attr("class", "axis-y")
			.style("transform","translate(50px,40px)")
			.call(this.yAxis);

		svg.append("g")
			.attr("class", "axis-x")
			.style("transform","translate(50px,"+(this.height-140)+"px)")
			.call(this.xAxis);

		this.constructLine(d[0]);
	}

	updateChartUI(d) {
		//const minMaxY = this.getMinMaxY(d);
		const svg = d3.select("body");
		//const y = this.scaleY.domain(minMaxY);

		d3.select(".axis-y").call(this.yAxis);

		for(let i = 0; i < d.length; i++) {
			
			if(!document.querySelector(".line-"+d[i].name)) {
				this.constructLine(d[i]);
			};
		};


	}
}




let chart = null;


// NAMESPACE CLASS FOR CHARACTER REGISTRY

class NS{
	constructor(name) {
		this.name = name;
		this.ns = io.connect(window.location.origin+"/"+name)
		this.ns.on("avg", (d) => {
			data.push(d);
			
			if(!document.querySelector("svg")) {
				chart = new Chart();
				chart.constructChart(data);
			}else {
				chart.updateChartUI(data);
			}
			
		})

		this.ns.on("data", d => {
			const line = chart.updateLine();

			console.log(line);
			const svg = d3.select("svg");
			svg.select(".line-"+d.name).attr("d",line(d.values));
		})

	};
}


//GUI CODE

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
