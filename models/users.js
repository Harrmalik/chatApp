var mongoose = require("mongoose");

var userSchema = new mongoose.Schema({
    username: String,
    password: String, //hash created from password
    created_at: {type: Date, default: Date.now},
    display_name: String,
    avatar: Number,
    followers: [String],
    follows: [String]
});

//declare a model called user for the user collection 
mongoose.model('User', userSchema);