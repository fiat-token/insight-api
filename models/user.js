var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    hash: String,
    salt: String
});

mongoose.model('User', userSchema);