/**
 * Created by jafari on 12/23/2016 AD.
 */
var mongoose = require('mongoose');

var movieSchema = new mongoose.Schema({
    actors: [{type: mongoose.Schema.ObjectId, ref: 'Actor', index: true}],
    awards: {type: String},
    country: [{type: String}],
    directors: [{type: mongoose.Schema.ObjectId, ref: 'Director', index: true}],
    genre: [{type: String, index: true}],
    language: [{type: String}],
    plot: {type: String},
    poster: {type: String},
    rating: {type: Number},
    rating_ref:{type:Number,index:true},
    runtime: {type: String},
    title: {type: String, index: true},
    trailer:{type: String},
    type: {type: String},
    writers: [{type: mongoose.Schema.ObjectId, ref: 'Writer', index: true}],
    year: {type: String},
    year_ref:{type:Number,index:true}
});

module.exports = mongoose.model('Movie', movieSchema);