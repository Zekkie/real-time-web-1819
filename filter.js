console.log(process.pid+" HAS STARTED")
const mongo = require("mongodb").MongoClient;
const url = "mongodb://134.209.9.142:27017";

const DictManifest = require("./bin/dictManifest.js");

const characters = new DictManifest();

const dictionairy = characters.manifest("./characters.dict");

function filter() {
	mongo.connect(url, (err, client) => {
		if(err) throw err;
		const db = client.db("gotTweets");
		const collection = db.collection("tweets");

		collection.find({}).toArray((err,items) => {
			if(err) throw err;
			const timeStart = new Date();
			const timeStartMs = timeStart.getTime();
			for(let i = 0; i < items.length; i++) {
				items[i].mentions = [];

				let query = {_id: items[i]._id};
				
				for(let j = 0; j < dictionairy.length; j++) {
					if(items[i].content.toLowerCase().includes(dictionairy[j])) {
						items[i].mentions.push(dictionairy[j]);
					};
				}
				let newVal = {$set: items[i]};
				
				collection.updateOne(query,newVal, (err,res) => {});
			}
			const timeEnd = new Date();
			const timeEndMs = timeEnd.getTime();
			console.log(timeEndMs - timeStart);
			//client.close();
		
		})

	})
}

filter();

