const fs = require("fs");

const mongo = require("mongodb").MongoClient;
const url = "mongodb://localhost:27017";



const bla = []



process.on("message", msg => {
	const pattern = "RT @";
	if(msg.in_reply_to_status_id === null && msg.text.indexOf(pattern) < 0 && msg.quoted_status_id === undefined) {
		toDB(nicerObj(msg))
	}
})


function toDB(obj) {
	mongo.connect(url, (err,client) => {
		if(err) throw err;

		const db = client.db("gotTweets");

		const collection = db.collection("tweets");

		collection.insertOne(obj, (err,res) => {
			collection.find({}).toArray((e,items) => {
			console.log(items);
			client.close();
		})
		})		
	})
}

function nicerObj(input) {
	const obj = {};
	const{created_at,id_str,text,user,sentiment} = input;

	const sentimentObj = {};

	sentimentObj.score = sentiment.score;
	sentimentObj.comparative = sentiment.comparative;

	obj.time_stamp = created_at;
	obj.id = id_str;
	obj.content = text;
	obj.user = user.screen_name;
	obj.user_id =+ user.id_str;
	obj.sentiment = sentimentObj;

	obj.url = `https://twitter.com/${obj.user}/status/${obj.id}`;


	

	return obj


}
