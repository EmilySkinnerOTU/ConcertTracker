let mongoose = require('mongoose');
// create a book model
let bookModel = mongoose.Schema({
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
module.exports = mongoose.model('Concerts', concertsModel);