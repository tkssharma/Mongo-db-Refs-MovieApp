/**
 * Created by jafari on 12/23/2016 AD.
 */
// Babel ES6/JSX Compiler
require('babel-core/register');

let swig = require('swig');
let React = require('react');
let ReactDOM = require('react-dom/server');
let Router = require('react-router');
let path = require('path');

let mongoose = require('mongoose');
let express = require('express');
let logger = require('morgan');
let bodyParser = require('body-parser');
let cookieParser = require('cookie-parser');
let reactCookie = require('react-cookie');

let routes = require('./app/routes');
let config = require('./config');
let UserAPI = require('./server/api/user');
let MovieAPI = require('./server/api/movie');
let GenreAPI = require('./server/api/genre');
let PersonAPI = require('./server/api/person');
let utils = require('./server/utils');

mongoose.connect(config.database);
mongoose.connection.on('error', function () {
    console.info('Error: Could not connect to MongoDB. Did you forget to run `mongod`?');
});

let app = express();

app.set('port', process.env.PORT || 80);
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//--------------------------------------------------------------//
//------------------------START OF API--------------------------//
//--------------------------------------------------------------//

//------------------------USER----------------------------//
/**
 * POST /api/authentication
 * Adds new user to the database.
 */
app.post('/api/authentication', UserAPI.post.authentication);

/**
 * POST /api/user/collect
 * Adds a movie to the user's collection
 */
app.post('/api/user/collect', UserAPI.post.collect);

/**
 * DELETE /api/user/collect
 * Removes a movie from the user's collection
 */
app.delete('/api/user/collect', UserAPI.delete.collect);

/**
 * POST /api/user/dislike
 * Adds a movie to the user's dislike
 */
app.post('/api/user/dislike', UserAPI.post.dislike);

/**
 * DELETE /api/user/dislike
 * Removes a movie from the user's dislike
 */
app.delete('/api/user/dislike', UserAPI.delete.dislike);

/**
 * GET /api/user/info
 * Gets the wishlist and the movie collection list of the authenticated user
 */
app.get('/api/user/info', UserAPI.get.info);

/**
 * POST /api/user/like
 * Adds a movie to the user's like
 */
app.post('/api/user/like', UserAPI.post.like);

/**
 * DELETE /api/user/like
 * Removes a movie from the user's like
 */
app.delete('/api/user/like', UserAPI.delete.like);

/**
 * POST /api/user/seen
 * Adds a movie to the user's seen
 */
app.post('/api/user/seen', UserAPI.post.seen);

/**
 * DELETE /api/user/seen
 * Removes a movie from the user's seen
 */
app.delete('/api/user/seen', UserAPI.delete.seen);

/**
 * POST /api/user/wishlist
 * Adds a movie to the user's wishlist
 */
app.post('/api/user/wishlist', UserAPI.post.wishlist);

/**
 * DELETE /api/user/wishlist
 * Removes a movie from the user's wishlist
 */
app.delete('/api/user/wishlist', UserAPI.delete.wishlist);

//------------------------MOVIE----------------------------//
/**
 * GET /api/movie
 * Gets the movie by the searched keyword
 */
app.get('/api/movie', MovieAPI.get.movie);

/**
 * GET /api/movie/imdb
 * Gets the movie by the searched keyword from imdb API
 */
app.get('/api/movie/imdb', MovieAPI.get.imdb);

/**
 * GET /api/movie/info
 * Gets the movie info
 */
app.get('/api/movie/info', MovieAPI.get.info);

/**
 * GET /api/movie/list
 * Gets the movies list
 */
app.get('/api/movie/list', MovieAPI.get.list);

/**
 * GET /api/movie/names
 * Gets the name of all movies - for home page autocomplete
 */
app.get('/api/movie/names', MovieAPI.get.names);

/**
 * PUT /api/movie/trailer
 * Updates the trailer of the movies
 */
app.put('/api/movie/trailer', MovieAPI.put.trailer);

//------------------------GENRE----------------------------//
/**
 * GET /api/genre/list
 * Gets the genres list
 */
app.get('/api/genre/list', GenreAPI.get.list);

//------------------------PERSON----------------------------//
/**
 * GET /api/person
 * Gets the selected person information
 */
app.get('/api/person', PersonAPI.get.person);

/**
 * GET /api/person/image
 * Gets the selected person image
 */
app.get('/api/person/image', PersonAPI.get.image);

/**
 * GET /api/person/info
 * Gets the selected person's info from Wikipedia
 */
app.get('/api/person/info', PersonAPI.get.info);
/**
 * GET /api/person/list
 * Gets a list of all persons
 */
app.get('/api/person/list', PersonAPI.get.list);

/**
 * GET /api/person/names
 * Gets the name of all persons - for autocomplete
 */
app.get('/api/person/names', PersonAPI.get.names);

//------------------------UTILS----------------------------//
/**
 * GET /people
 * Gets the name of all persons
 */
app.get('/people', utils.api.get.people);

/**
 * GET /removeImage
 * removes the given image
 */
app.get('/removeImage', utils.api.get.removeImage);

//--------------------------------------------------------------//
//------------------------END OF API----------------------------//
//--------------------------------------------------------------//

app.use(function (req, res) {
    Router.match({routes: routes.default, location: req.url}, function (err, redirectLocation, renderProps) {
        if (err) {
            res.status(500).send(err.message)
        } else if (redirectLocation) {
            res.status(302).redirect(redirectLocation.pathname + redirectLocation.search)
        } else if (renderProps) {
            reactCookie.plugToRequest(req, res);
            let html = ReactDOM.renderToString(React.createElement(Router.RouterContext, renderProps));
            let page = swig.renderFile('views/index.html', {html: html});
            res.status(200).send(page);
        } else {
            res.status(404).send('Page Not Found')
        }
    });
});

app.listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});