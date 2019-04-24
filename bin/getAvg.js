const RollingAvarage = require("./RollingAvarage.js");
const mongo = require("mongodb").MongoClient;
const url = "mongodb://134.209.9.142:27017";




class MyFirstAvarage{
	constructor(name) {
		this.name = name;
		this.today = new Date().setHours(0,0,0,0);
	}

	onConnection(callback) {
		mongo.connect(url, (err, client) => {
			if(err) throw err;

			const db = client.db("gotTweets");
			const collection = db.collection("tweets");

			collection.find({mentions:this.name,time_stamp:{$gt:this.today}}).toArray((e,i) => {
				let rlA = new RollingAvarage();

				let avg = rlA.getAvarage(i);

				callback(avg);
			})
		})
	}
}



module.exports = MyFirstAvarage;




