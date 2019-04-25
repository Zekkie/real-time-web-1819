#!/usr/bin/env nodejs

const {fork} = require("child_process");
const forkedProcess = fork("./jsonToFile.js");
const DictManifest = require("./bin/dictManifest.js");
const characters = new DictManifest();
const dictionairy = characters.manifest("./characters.dict");
const Observer = require("./bin/Observer.js");
const express = require("express");
const app = express();
const server = require("http").createServer(app)
const io = require("socket.io")(server);
const Sentiment = require("sentiment");
const analyzer = new Sentiment();
const {dateFormatter} = require("./bin/helpers.js")
const TwitterStream = require("twitter-stream-api");
const Manifest = require("./bin/configManifest.js");
const MyFirstAvarage = require("./bin/getAvg.js");


class Namespace{
    constructor(name) {
        this.name = name
        this.ns = io.of("/"+name);
        this.ns.on("connection",(socket) => {
            const conn = new MyFirstAvarage(this.name);
            conn.onConnection((a) => {
                socket.emit("avg",{values:a, name: this.name});
            });
        });
    }
}
const namespaceObserver = new Observer();
for(let i = 0; i < dictionairy.length; i++) {
    namespaceObserver.subscribe(new Namespace(dictionairy[i]));
};
const apiManifest = new Manifest();
const serverManifest = new Manifest();
app.use(express.static("static"));
apiManifest.manifest("./api.cnf");
serverManifest.manifest("./server.cnf");
io.on("connection",(socket) =>{
   socket.emit("names", dictionairy)
})
//TWITTER STUFF
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


//tweet to CP
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

forkedProcess.on("message",(d) => {
    namespaceObserver.update(d);
})