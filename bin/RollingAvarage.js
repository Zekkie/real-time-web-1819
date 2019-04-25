class RollingAvarage {
	tokenize(arr) {
		const tokens = arr.map((i) => {
			const hour = new Date(i.time_stamp).getHours();
			return {hour:hour,score:i.sentiment.score};
		});
		let hours = this.getHours(tokens);
		const split = this.splitTokens(tokens,hours);
		return split;
	};
	getAvarage(arr) {
		let sum = 0;
		const tokens = this.tokenize(arr);
		const avgArr = [];
		for(let i = 0 ; i < tokens.length; i++) {
			const obj = {
				avg:0,
				hour:0
			}
			for(let j = 0; j < tokens[i].length; j++) {
				obj.hour = tokens[i][j].hour;
				
				sum+=tokens[i][j].score;
			}
			obj.avg = sum/tokens[i].length
			avgArr.push(obj);
			sum = 0;
		};
		return avgArr;
	}
	splitTokens(tokens,time) {
		const split = [];
		for(let i = 0; i < time.length;i++) {
			let arr = new Array();
			for(let j = 0; j < tokens.length; j++) {
				if(time[i] === tokens[j].hour) {
					arr.push(tokens[j])
				}
			}
			split.push(arr);
		};
		return split;
	}
	getHours(tokens) {
		let currentTime = tokens[0].hour;	
		const hours = [];
		hours.push(currentTime);
		tokens.forEach( i => {
				

				if(currentTime < i.hour) {
					currentTime = i.hour
					hours.push(currentTime);
				}
		})
		return hours;
	}
}


module.exports = RollingAvarage;