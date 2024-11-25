let mongoose = require('mongoose');

let ConcertTracker = mongoose.Schema({
    Artist: String,
    Genre: String,
    Date: String,
    Location: String,
    Cost: Number
    },
    {
        collection: "concerts"
    }
);
module.exports = mongoose.model('concerts', ConcertTracker);
//assignes what database mongodb is using