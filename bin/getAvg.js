const RollingAvarage = require("./RollingAvarage.js");
const mongo = require("mongodb").MongoClient;
const url = "mongodb://134.209.9.142:27017";

class NewAvarage{
	constructor(name) {
		this.name = name;
		this.today = new Date().setHours(0,0,0,0);
		
	}
	onNew(callback) {
		mongo.connect(url, (err, client) => {
			//console.log(this.name);
			if(err) throw err;
			const db = client.db("gotTweets");
			const collection = db.collection("tweets");
			collection.find({mentions:this.name,time_stamp:{$gt:this.today}}).sort({time_stamp:1}).toArray((e,i) => {
				if(i.length > 0) {
					let rlA = new RollingAvarage();
					let avg = rlA.getAvarage(i);
					callback(avg);
					client.close();
				}
				
			})
		})
	}
}



module.exports = NewAvarage;




