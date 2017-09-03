var mongoose = require( 'mongoose' ),
    // Schema = mongoose.Schema,
    dbURI = 'mongodb://localhost/MAPProjectManager';

// Create the database connection
mongoose.connect(dbURI);

// Define connection events
mongoose.connection.on('connected', function () {
  console.log('Mongoose connected to ' + dbURI);
});

mongoose.connection.on('error',function (err) {
  console.log('Mongoose connection error: ' + err);
});

mongoose.connection.on('disconnected', function () {
  console.log('Mongoose disconnected');
});

process.on('SIGINT', function() {
  mongoose.connection.close(function () {
    console.log('Mongoose disconnected through app termination');
    process.exit(0);
  });
});

var projectSchema = new mongoose.Schema({
  projectName: String,
  modifiedOn: Date,
  createdOn: { type: Date, default: Date.now },
  createdBy: String,
  contributors: String,
  tasks: String
});


projectSchema.post('init', function(doc) {
  console.log('%s has been initialized from the db', doc._id);
});
projectSchema.post('validate', function(doc) {
  console.log('%s has been validated (but not saved yet)', doc._id);
});
projectSchema.post('save', function(doc) {
  console.log('%s has been saved', doc._id);
});
projectSchema.post('remove', function(doc) {
  console.log('%s has been removed', doc._id);
});

projectSchema.pre('find', function() {
  console.log(this instanceof mongoose.Query); // true
  this.start = Date.now();
});

projectSchema.post('find', function(result) {
  console.log(this instanceof mongoose.Query); // true
  // prints returned documents
  console.log('find() returned ' + JSON.stringify(result));
  // prints number of milliseconds the query took
  console.log('find() took ' + (Date.now() - this.start) + ' millis');
});


projectSchema.statics.findByUserID = function (userid, callback) {
  this.find({ createdBy: userid }, '_id projectName', {sort: 'modifiedOn'}, callback);
};

// Build the Project model
var Project = mongoose.model( 'Project', projectSchema );
