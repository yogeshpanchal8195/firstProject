const Twit = require('twit');
const config = require('../config/config');
const express = require('express');
const router = express.Router();
const _ = require('lodash');
const { Tweet, favouriteTweet } = require('../models/tweet');


var twit = new Twit({
    consumer_key: config.consumer_key,
    consumer_secret: config.consumer_secret,
    access_token: config.access_token,
    access_token_secret: config.access_token_secret,
    timeout_ms: 60 * 1000,  // optional HTTP request timeout to apply to all requests.
    strictSSL: true,     // optional - requires SSL certificates to be valid.
});

router.get('/search', async (req, res) => {
    const search = `${req.query.text}`;
    twit.get('search/tweets', { q: search, count: 20 })
        .then((data, response) => {
            if (data) {
                var tweets = new Tweet();
                tweets.entries = data.data.statuses;
                var result = tweets.save();
                res.send(data);
            }
        })
        .catch((err) => {
            res.status(500).send();
        })
});


router.post('/favourite', async (req, res) => {
    try {
        var Data = await favouriteTweet.findOne({ _id: req.body.id });
        console.log("DATA",Data);
        if (Data) {
            let obj= {};
            var delres = await favouriteTweet.deleteOne({ _id: req.body.id});
            console.log("delres",delres);
            obj.data= Data;
            obj.flag=0;
            res.status(200).send(obj);
        } else {
            var tweetData = new favouriteTweet();
            tweetData.favourite = req.body;
            tweetData._id = req.body.id;
            var result = await tweetData.save();
            if (result) {
                let obj= {};
                obj.flag=1;
                obj.data=result
                res.status(200).send(obj);
            } else {
                res.status(500).send();
            }
        }
    }
    catch (err) {
        console.log(err);
    }
});

router.get('/favouritesList', async (req, res) => {
    try {
            var result=await favouriteTweet.find();
            if (result) {
                res.status(200).send(result);
            } else {
                res.status(500).send();
            }
    }
    catch (err) {
        console.log(err);
    }
});

module.exports = router;


