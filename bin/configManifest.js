const fs = require("fs");
class Manifest{
	constructor() {
	  this.file = "";
	}

	manifest(file) {
		this.file = fs.readFileSync(file).toString();
		this.manifestProcess();	
	}

	removeNewLine() {
		return this.file.replace(new RegExp("\n","g"),"");
	};

	splitCnf() {
		return this.removeNewLine().split(";");
	};

	getKVP() {
		const _arr = this.splitCnf();
		_arr.splice(_arr.length-1,1);
		return _arr;
	}

	splitKVP() {
		const _arr = this.getKVP();
		const _kvpArr = [];
		
		for(let i = 0; i < _arr.length; i++) {
			_kvpArr.push(_arr[i].split(" "));
		};

		return _kvpArr;
	}
	
	manifestProcess() {
		const _arr = this.splitKVP();
		for(let i = 0; i < _arr.length;i++) {
			process.env[_arr[i][0]] = _arr[i][1];
		}
	}	

};
module.exports = Manifest;
