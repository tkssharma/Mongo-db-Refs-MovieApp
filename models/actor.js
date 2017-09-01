/**
 * Created by jafari on 12/23/2016 AD.
 */
var mongoose = require('mongoose');

var actorSchema = new mongoose.Schema({
    image:{type:String},
    movies:[{type:mongoose.Schema.ObjectId, ref: 'Movie'}],
    movies_count:{type:Number,index:true},
    count_ref:{type:Number,index:true},
    name:{type:String,index:true},
    summary:{type:String}
});

module.exports = mongoose.model('Actor', actorSchema);