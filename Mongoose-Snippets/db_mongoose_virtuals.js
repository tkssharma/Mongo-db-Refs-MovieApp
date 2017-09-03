// define user schema
var userSchema = new Schema({
    first: String,
    last: String
});

// compile our model
var User = mongoose.model('User', userSchema);

// create a document
var mentalist = new User({
    first: 'Patrick',
    last: 'Jane'
});
