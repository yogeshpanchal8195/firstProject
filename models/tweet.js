const mongoose = require('mongoose');


const schema = new mongoose.Schema({
    entries:{
        type:Array
    }
})


const objschema = new mongoose.Schema({
    _id:{
        type:String
    },
    favourite:{
        type:Object
    }
})

const tweetData = mongoose.model('Tweet',schema);
const favouriteTweetData = mongoose.model('favouriteTweet',objschema);


module.exports.Tweet=tweetData;
module.exports.favouriteTweet=favouriteTweetData;
