/**
 * Created by jafari on 12/23/2016 AD.
 */
var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
    movies:[{type:mongoose.Schema.ObjectId, ref: 'Movie'}],
    password:{type:String, required:true},
    username:{type:String, unique:true, required:true},
    wishlist:[{type:mongoose.Schema.ObjectId, ref: 'Movie'}],
    seen:[{type:mongoose.Schema.ObjectId, ref: 'Movie'}],
    liked:[{type:mongoose.Schema.ObjectId, ref: 'Movie'}],
    disliked:[{type:mongoose.Schema.ObjectId, ref: 'Movie'}]
});

module.exports = mongoose.model('User', userSchema);