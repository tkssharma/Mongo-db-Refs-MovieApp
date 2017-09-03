var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var personSchema = Schema({
  _id: Schema.Types.ObjectId,
  name: String,
  age: Number,
  stories: [{ type: Schema.Types.ObjectId, ref: 'Story' }]
});

var storySchema = Schema({
  author: { type: Schema.Types.ObjectId, ref: 'Person' },
  title: String,
  fans: [{ type: Schema.Types.ObjectId, ref: 'Person' }]
});

var Story = mongoose.model('Story', storySchema);
var Person = mongoose.model('Person', personSchema);

var author = new Person({
  _id: new mongoose.Types.ObjectId(),
  name: 'Ian Fleming',
  age: 50
});

author.save(function (err) {
  if (err) return handleError(err);

  var story1 = new Story({
    title: 'Casino Royale',
    author: author._id    // assign the _id from the person
  });

  story1.save(function (err) {
    if (err) return handleError(err);
    // thats it!
  });
});


Story.
findOne({ title: 'Casino Royale' }).
populate('author').
exec(function (err, story) {
  if (err) return handleError(err);
  console.log('The author is %s', story.creator.name);
  // prints "The author is Ian Fleming"
});


Story.
findOne({ title: /casino royale/i }).
populate('author', 'name'). // only return the Persons name
exec(function (err, story) {
  if (err) return handleError(err);

  console.log('The author is %s', story.author.name);
  // prints "The author is Ian Fleming"

  console.log('The authors age is %s', story.author.age);
  // prints "The authors age is null'
})


Story.
find().
populate({ path: 'fans', select: 'name' }).
populate({ path: 'fans', select: 'email' });
// The above is equivalent to:
Story.find().populate({ path: 'fans', select: 'email' });


Story.
find(...).
populate({
  path: 'fans',
  match: { age: { $gte: 21 }},
  // Explicitly exclude `_id`, see http://bit.ly/2aEfTdB
  select: 'name -_id',
  options: { limit: 5 }
}).
exec()
