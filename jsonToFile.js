console.log(process.pid+" HAS STARTED")
const {fork} = require("child_process");
const filterFork = fork("./filter.js");
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
			if(err) throw err;
			client.close()
		})		
	})
}

const dictionairy = ["jon", "arya", "sansa","ramsey","bolton","stark","lannister","tyrion","tyrell"];

function nicerObj(input) {
	let tText = ""
	if(input.truncated) {
		tText = input.extended_tweet.full_text
	}else {
		tText = input.text
	}
	const obj = {};
	const{created_at,id_str,text,user,sentiment} = input;
	const sentimentObj = {};
	sentimentObj.score = sentiment.score;
	sentimentObj.comparative = sentiment.comparative;
	obj.time_stamp = created_at;
	obj.id = id_str;
	obj.content = tText;
	obj.user = user.screen_name;
	obj.user_id =+ user.id_str;
	obj.sentiment = sentimentObj;
	obj.url = `https://twitter.com/${obj.user}/status/${obj.id}`;
	obj.mentions = [];
	for(let i = 0; i < dictionairy.length; i++) {
		if(obj.content.toLowerCase().includes(dictionairy[i])) {
			obj.mentions.push(dictionairy[i]);
		};
	};

	console.log(obj)
	return obj;
}






