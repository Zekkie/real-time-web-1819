const RollingAvarage = require("./RollingAvarage.js");
const mongo = require("mongodb").MongoClient;
const url = "mongodb://134.209.9.142:27017";

class MyFirstAvarage{
	constructor(name) {
		this.name = name;
		this.today = new Date("apr 22 00:00 2019").getTime();
		this.limit = new Date("apr 22 10:00 2019").getTime();
	}
	onConnection(callback) {
		mongo.connect(url, (err, client) => {
			if(err) throw err;
			const db = client.db("gotTweets");
			const collection = db.collection("tweets");
			collection.find({mentions:this.name,time_stamp:{$gt:this.today,$lt:this.limit}}).sort({time_stamp:1}).toArray((e,i) => {
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



module.exports = MyFirstAvarage;




