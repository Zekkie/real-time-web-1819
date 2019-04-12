const fs = require("fs");
class Manifest{
	constructor() {
	  this.file = "";
	}

	manifest(file) {
		this.file = fs.readFileSync(file).toString();
		this.manifestProcess();
	}

	fileToRawArray() {
		return this.file.split(";");
	};

	removeEmptyIndex() {
		const _arr = this.fileToRawArray();
		_arr.splice(_arr.length-1,1)
		return _arr;
	}

	removeLineBreak() {
		const _arr = this.removeEmptyIndex();
		for(let i = 0; i < _arr.length; i++) {
			_arr[i] = _arr[i].replace("\r\n", "");
		};
		return _arr;
	}

	convertToKvp() {
		const _arr = [];
		for(let i = 0; i < this.removeLineBreak().length; i++) {
			_arr.push(this.removeLineBreak()[i].split(" "))
		}
		return _arr;
	}

	removeDoublePoint() {
		const _arr = this.convertToKvp();
		for(let i = 0; i < _arr.length; i++) {
			_arr[i][0] = _arr[i][0].replace(":","");
		};
		return _arr;
	}

	manifestProcess() {
		const _arr = this.removeDoublePoint();
		for(let i = 0; i < _arr.length; i++) {
			process.env[_arr[i][0]] = _arr[i][1];
		};
	};

};
module.exports = Manifest;