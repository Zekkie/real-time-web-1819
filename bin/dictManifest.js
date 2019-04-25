const fs = require("fs");
class DictManifest{
	constructor() {
	  this.file = "";
	}

	manifest(file) {
		this.file = fs.readFileSync(file).toString();
		return this.splitDict()
	}

	removeNewLine() {
		return this.file.replace(new RegExp("\n","g"),"");
	};

	splitDict() {
		const arr = this.removeNewLine().split(";");
		arr.splice(arr.length-1,1);

		for(let i = 0; i < arr.length; i++) {
			arr[i] = arr[i].replace("\r","");
		}
		return arr;
	}
};

module.exports = DictManifest;