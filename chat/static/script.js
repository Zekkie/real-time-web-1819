const socket = io.connect("http://localhost:1000");




const dash = new Audio("dash.wav");
const dot = new Audio("dot.wav");

const morse = [
	{
		u: "A",
		l: "a",
		morse: [".", "-"]
	},
	{
		u: "B",
		l: "b",
		morse: [".", "-", "-", "-"]
	},
	{
		u: "C",
		l: "c",
		morse: ["-", ".", "-", "."]
	},
	{
		u: "D",
		l: "d",
		morse: ["-",".","."]
	},
	{
		u:"E",
		l:"e",
		morse: ["."]
	},
	{
		u:"F",
		l:"f",
		morse: [".",".","-","."]
	},
	{
		u:"G",
		l:"g",
		morse: ["-","-","."]
	},
	{
		u:"H",
		l:"h",
		morse: [".",".",".","."]
	},
	{
		u:"I",
		l:"i",
		morse: [".","."]
	},
	{
		u:"J",
		l:"j",
		morse: [".","-","-","-"]
	},
	{
		u:"K",
		l:"k",
		morse: ["-",".","-"]
	},
	{
		u:"L",
		l:"l",
		morse: [".","-",".","."]
	},
	{
		u:"M",
		l:"m",
		morse: ["-","-"]
	},
	{
		u:"N",
		l:"n",
		morse: ["-","."]
	},
	{
		u:"O",
		l:"o",
		morse: ["-","-","-"]
	},
	{
		u:"P",
		l:"p",
		morse: [".","-","-","."]
	},
	{
		u:"Q",
		l:"q",
		morse: ["-","-",".","-"]
	},
	{
		u:"R",
		l:"r",
		morse: [".","-","."]
	},
	{
		u:"S",
		l:"s",
		morse: [".",".","."]
	},
	{
		u:"T",
		l:"t",
		morse: ["-"]
	},
	{
		u:"U",
		l:"u",
		morse: [".",".","-"]
	},
	{
		u:"V",
		l:"v",
		morse: [".",".",".","-"]
	},
	{
		u:"W",
		l:"w",
		morse: [".","-","-"]
	},
	{
		u:"X",
		l:"x",
		morse: ["-",".",".","-"]
	},
	{
		u:"Y",
		l:"y",
		morse: ["-",".","-","-"]
	},
	{
		u:"Z",
		l:"z",
		morse: ["-","-",".","."]
	},
	{
		u:"0",
		l:"0",
		morse: ["-","-","-","-","-"]
	},
	{
		u:"1",
		l:"1",
		morse: [".","-","-","-","-"]
	},
	{
		u:"2",
		l:"2",
		morse: [".",".","-","-","-"]
	},
	{
		u:"3",
		l:"3",
		morse: [".",".",".","-","-"]
	},
	{
		u:"4",
		l:"4",
		morse: [".",".",".",".","-"]
	},
	{
		u:"5",
		l:"5",
		morse: [".",".",".",".","."]
	},
	{
		u:"6",
		l:"6",
		morse: ["-",".",".",".","."]
	},
	{
		u:"7",
		l:"7",
		morse: ["-","-",".",".","."]
	},
	{
		u:"8",
		l:"8",
		morse: ["-","-","-",".","."]
	},
	{
		u:"9",
		l:"9",
		morse: ["-","-","-","-","."]
	}
];

let wholeInput = []

function morsefy(input) {
	let morseWord = []
	input.forEach((l) => {
		let m = morse.find((p) => {
			return p.l === l || p.u === l;
		});

		if(m != undefined) {
			morseWord.push(m.morse);
		}
	});

	wholeInput.push(morseWord);
};

function deconstructWord(input) {
	input.forEach((w) => {
		morsefy(w.split(""))
	})
}

function createMorseString(input) {
	let morseStr = ""
	for(let i = 0; i < input.length; i++) {
		for(let o = 0; o < input[i].length; o++) {
			for(let j = 0; j < input[i][o].length; j++) {
				let sound = input[i][o][j];
				morseStr += sound;
			}
		};
	};
	console.log(morseStr)
	return morseStr;
};

function deconstructMorse(input) {
	return input.split("");
}

function PlayMorse() {
	this.i = 0;
	this.morse = [];
	this.getMorse = function(input) {
		this.morse = input;
		
	}



	this.play = function() {
		setTimeout(() => {
			if(this.i < this.morse.length) {
				
				if(this.morse[this.i] === ".") {
					dot.play().catch(e => {
						console.log(e.message)
					})
				}else if(this.morse[this.i] === "-") {
					dash.play().catch(e => {
						console.log(e.message)
					})
				}

				this.i = this.i += 1;
				this.play();
			}
			
		},100)
	}
};

function deconstructInput(input) {
	const player = new PlayMorse();
	let dotless = input.replace(".","");
	let comaless = dotless.replace(",", "");
	let wordLS = comaless.split(" ");
	deconstructWord(wordLS);
	player.getMorse(deconstructMorse(createMorseString(wholeInput)));
	player.play();
	wholeInput = [];
}




socket.on("commando", (d) => {
	console.log(d.command)
	deconstructInput(d.command)
})