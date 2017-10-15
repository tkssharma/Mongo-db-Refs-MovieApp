// Instance methods Static methods Virtuals
// populate api design
// virtual api design
const AuthorSchema = new Schema({
 name: String,
 posts: [
  {
   type: mongoose.Schema.Types.ObjectId,
   ref: 'BlogPost'
  }
 ]
});

const BlogPostSchema = new Schema({
 title: String,
 comments: [
  {
   author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Author'
   },
   content: String
  }
 ]
});

const Author = mongoose.model('Author', AuthorSchema, 'Author');
const BlogPost = mongoose.model('BlogPost', BlogPostSchema, 'BlogPost');

Author
 .findOne()
 .populate('posts')
 .exec(function (error, author) {
  // `author.posts` is an array of `BlogPost` documents
 });

//Lets do with Virtuals

const AuthorSchema = new Schema({name: String});

// Specifying a virtual with a `ref` property is how you enable virtual
// population
AuthorSchema.virtual('posts', {
 ref: 'BlogPost',
 localField: '_id',
 foreignField: 'author'
});

const BlogPostSchema = new Schema({
 title: String,
 author: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'Author'
 },
 comments: [
  {
   author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Author'
   },
   content: String
  }
 ]
});

const Author = mongoose.model('Author', AuthorSchema, 'Author');
const BlogPost = mongoose.model('BlogPost', BlogPostSchema, 'BlogPost');