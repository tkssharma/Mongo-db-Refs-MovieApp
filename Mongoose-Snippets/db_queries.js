
var projectSchema = new mongoose.Schema({
  projectName: String,
  modifiedOn: Date,
  createdOn: { type: Date, default: Date.now },
  createdBy: String,
  contributors: String,
  tasks: String
});

// Build the Project model
mongoose.model( 'Project', projectSchema );

// In mongoose 4, a Query has a .then() function, and thus can be used as a promise.
