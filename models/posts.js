var mongoose = require("mongoose");

var postSchema = new mongoose.Schema({
    created_by: String,
    created_at: {type: Date, default: Date.now},
    text: String,
    likes: Number
});

//declare a model called post for the post collection 
mongoose.model('Post', postSchema);