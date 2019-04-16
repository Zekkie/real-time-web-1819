#!/usr/bin/env nodejs
console.log(process.pid+" HAS STARTED")
const {fork} = require("child_process");
const forkedProcess = fork("./jsonToFile.js");




const express = require("express");
const app = express();
const server = require("http").createServer(app)
const io = require("socket.io")(server);
const fs = require("fs");
const Sentiment = require("sentiment");
const analyzer = new Sentiment();
const {dateFormatter} = require("./bin/helpers.js")
const TwitterStream = require("twitter-stream-api");
const Manifest = require("./bin/configManifest.js");


const apiManifest = new Manifest();
const serverManifest = new Manifest();

app.use(express.static("static"));

apiManifest.manifest("./api.cnf");
serverManifest.manifest("./server.cnf");






var keys = {
    consumer_key : process.env.CONSUMER_KEY,
    consumer_secret : process.env.CONSUMER_SECRET,
    token : process.env.TOKEN,
    token_secret : process.env.TOKEN_SECRET
};



const twitter = new TwitterStream(keys,false);


twitter.stream("statuses/filter",{track:"#got", language:"en",tweet_mode:"extended"});


twitter.on('connection error http', function (httpStatusCode) {
    console.log('connection error http', httpStatusCode);
});

twitter.on('connection success', function (uri) {
    console.log('connection success', uri);
});




twitter.on("data", (d) => {
	const data = JSON.parse(d.toString());
    let sentiment = {};


    if(data.truncated) {
       sentiment = analyzer.analyze(data.extended_tweet.full_text);
    }else {
       sentiment = analyzer.analyze(data.text); 
    }
	data.created_at = dateFormatter(data.created_at);
    data.sentiment = sentiment;
    forkedProcess.send(data);
});


app.get("/",(req, res) => {
	res.sendFile(__dirname+"/static/html/index.html")
})

server.listen(process.env.PORT, function() {
	console.log("SERVER RUNNING ON PORT: " + process.env.PORT);
});
