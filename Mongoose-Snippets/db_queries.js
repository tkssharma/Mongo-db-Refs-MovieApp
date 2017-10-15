
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
const Person = require("../models/person");

// .find() finds all instances in the database that match the query you pass in.
// It returns an array, even if there is only one item in the array.

// No query passed in means "find everything"
Person.find((err, people) => {
    if (err) {
        // Note that this error doesn't mean nothing was found,
        // it means the database had an error while searching, hence the 500 status
        res.status(500).send(err)
    } else {
        // send the list of all people
        res.status(200).send(people);
    }
});

// If query IS passed into .find(), filters by the query parameters
Person.find({"name": "John James", "age": 36}, (err, people) =>{
    if (err) {
        res.status(500).send(err)
    } else {
        // send the list of all people in database with name of "John James" and age of 36
        // Very possible this will be an array with just one Person object in it.
        res.status(200).send(people);
    }
});
//------------------------------------------------------------------//

Kitten.findOne(
    {"color": "white", "name": "Dr. Miffles", "age": 1},  // query
    {"name": true, "owner": true},  // Only return an object with the "name" and "owner" fields. "_id" is included by default, so you'll need to remove it if you don't want it.
    (err, kitten) => {
        if (err) {
            res.status(200).send(err)
        }
        if (kitten) {  // Search could come back empty, so we should protect against sending nothing back
            res.status(200).send(kitten)
        } else {  // In case no kitten was found with the given query
            res.status(200).send("No kitten found")
        }
    }
);


// Common RESTful way to get the Id is from the url params in req.params
Kitten.findById(req.params.kittenId, (err, kitten) => {
    if (err) {
        res.status(500).send(err)
    }
    if (kitten) {
        res.status(200).send(kitten)
    } else {
        res.status(404).send("No kitten found with that ID")
    }
});

const Todo = require("../models/todo");

// Assuming this is from a POST request and the body of the
// request contained the JSON of the new "todo" item to be saved
let todo = new Todo(req.body);
todo.save((err, createdTodoObject) => {
    if (err) {
        res.status(500).send(err);
    }
    // This createdTodoObject is the same one we saved, but after Mongo
    // added its additional properties like _id.
    res.status(200).send(createdTodoObject);
});


const Todo = require("../models/todo");

// This would likely be inside of a PUT request, since we're updating an existing document, hence the req.params.todoId.
// Find the existing resource by ID
Todo.findById(req.params.todoId, (err, todo) => {
    // Handle any possible database errors
    if (err) {
        res.status(500).send(err);
    } else {
        // Update each attribute with any possible attribute that may have been submitted in the body of the request
        // If that attribute isn't in the request body, default back to whatever it was before.
        todo.title = req.body.title || todo.title;
        todo.description = req.body.description || todo.description;
        todo.price = req.body.price || todo.price;
        todo.completed = req.body.completed || todo.completed;

        // Save the updated document back to the database
        todo.save((err, todo) => {
            if (err) {
                res.status(500).send(err)
            }
            res.status(200).send(todo);
        });
    }
});


Todo.findByIdAndRemove(req.params.todoId, (err, todo) => {
    // We'll create a simple object to send back with a message and the id of the document that was removed
    // You can really do this however you want, though.
    le response = {
        message: "Todo successfully deleted",
        id: todo._id
    };
    res.status(200).send(response);
});
