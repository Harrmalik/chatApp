var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var userSchema = new Schema({
    username: String,
    password: String, //hash created from password
    created_at: {type: Date, default: Date.now},
    display_name: String,
    avatar: Number,
    followers: [String],
    follows: [String],
    posts: [{
        id: {type: Schema.Types.ObjectId, unique: true},
        //created_by: String,
        created_at: {type: Date, default: Date.now},
        text: String,
        likes: Number
    }]
});

//declare a model called user for the user collection 
mongoose.model('User', userSchema);