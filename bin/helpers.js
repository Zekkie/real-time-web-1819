function dateFormatter(dateStr){
	const dateArray = dateStr.split(" ");
	const newDateStr = dateArray[0]+" "+dateArray[1]+" "+dateArray[2] + " " + dateArray[5] + " " + dateArray[3] + " GMT" + dateArray[4]
	return Date.parse(newDateStr);
}

module.exports.dateFormatter = dateFormatter;