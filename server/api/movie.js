/**
 * Created by amin on 2/1/17.
 */
let request = require('request');
let async = require('async');
let config = require('../../config');
let common = require('../common');
let User = require('../../models/user');
let Movie = require('../../models/movie');

let queries = {
    people: {
        names: [
            {
                path: 'actors',
                select: 'name'
            },
            {
                path: 'directors',
                select: 'name'
            },
            {
                path: 'writers',
                select: 'name'
            }
        ],
        names_images: [
            {
                path: 'actors',
                select: '_id name image'
            }, {
                path: 'directors',
                select: '_id name image'
            }, {
                path: 'writers',
                select: '_id name image'
            }
        ]
    }
};
let addMovieToPerson = function (type, persons, addedMovie, personsArray, callback) {
    for (let i = 0; i < persons.length; i++) {
        let indexOf = persons[i].indexOf('(') - 1;
        if (indexOf > -1) {
            persons[i] = persons[i].substr(0, indexOf) + persons[i].substr(persons[i].length);
        }
        common.Person[type].model.findOneAndUpdate({name: persons[i]}, {
            $push: {movies: addedMovie._id},
            $inc: {movies_count: 1}
        }, {
            upsert: true,
            new: true
        }, function (err, person) {
            if (err) console.log('error', err);
            personsArray.push(person._id);
            if (i === persons.length - 1) {
                callback();
            }
        });
    }
};

let saveMovie = function (movie, next, parsedResponse, res) {
    movie.save(function (err, addedMovie) {
        if (err) return next(err);
        let actors = parsedResponse.Actors.split(', ');
        let directors = parsedResponse.Director.split(', ');
        let writers = parsedResponse.Writer.split(', ');
        let actorsArray = [];
        let directorsArray = [];
        let writersArray = [];
        async.waterfall([async.apply(addMovieToPerson, 'actors', actors, addedMovie, actorsArray),
            async.apply(addMovieToPerson, 'directors', directors, addedMovie, directorsArray),
            async.apply(addMovieToPerson, 'writers', writers, addedMovie, writersArray),
            function () {
                let populateQuery = queries.people.names;
                Movie.findByIdAndUpdate(addedMovie._id, {
                    actors: actorsArray,
                    directors: directorsArray,
                    writers: writersArray
                }, {new: true})
                    .populate(populateQuery)
                    .exec(function (err, populated) {
                        common.updateDataRefs();
                        res.send(populated);
                    });
            }
        ]);
    });
};

module.exports = {
    get: {
        movie (req, res) {
            let populateQuery = queries.people.names;

            Movie.findOne({title: req.query.movieName})
                .populate(populateQuery)
                .exec(function (err, populated) {
                    res.send(populated);
                });
        },
        imdb (req, res, next) {
            let url = 'http://www.omdbapi.com/?t=' + encodeURIComponent(req.query.movieName) + '&y=&plot=short&r=json';
            request.get(url, function (err, requestContent, response) {
                if (err) return next(err);
                let parsedResponse;
                try {
                    parsedResponse = JSON.parse(response);
                }
                catch (jsonError) {
                    console.log(jsonError);
                    res.send(response);
                    return false;
                }
                if (parsedResponse && typeof parsedResponse !== 'undefined' && parsedResponse.Response === 'True') {
                    let populateQuery = queries.people.names;
                    Movie.findOne({title: parsedResponse.Title})
                        .populate(populateQuery)
                        .exec(function (err, populated) {
                            if (populated) {
                                res.send(populated);
                            }
                            else {
                                let movie = new Movie({
                                    title: parsedResponse.Title,
                                    year: parsedResponse.Year,
                                    runtime: parsedResponse.Runtime,
                                    genre: parsedResponse.Genre.split(', '),
                                    plot: parsedResponse.Plot,
                                    language: parsedResponse.Language.split(', '),
                                    country: parsedResponse.Country.split(', '),
                                    rating: parsedResponse.imdbRating,
                                    type: parsedResponse.Type,
                                    awards: parsedResponse.Awards,
                                    poster: config.imageURL + parsedResponse.Title.replace(/[^a-z0-9]/gi, '_') + '.jpg'
                                });

                                if (parsedResponse.Poster !== 'N/A') {
                                    common.download(parsedResponse.Poster, movie.poster, function () {
                                        saveMovie(movie, next, parsedResponse, res);
                                    });
                                }
                                else {
                                    saveMovie(movie, next, parsedResponse, res);
                                }
                            }
                        });
                }
                else {
                    res.send(response);
                }
            });
        },
        info (req, res) {
            let id = req.query.id;
            let populateQuery = queries.people.names_images;

            Movie.findById(id)
                .populate(populateQuery)
                .exec(function (err, populatedMovie) {
                    res.send(populatedMovie);
                });
        },
        list (req, res) {
            let lastItem = req.query.lastItem;
            let field = req.query.field;
            let search = req.query.search;
            let genre = req.query.genre;
            let category = req.query.category;
            let id = req.query.id;
            let direction = parseInt(req.query.direction);
            let populateQuery = queries.people.names;
            let query = {};
            if (genre) {
                query.genre = genre;
            }
            if (search.trim() !== '') {
                query.title = search;
            }
            else {
                if (field === 'rating' || field === 'year') {
                    field += '_ref';
                    if (direction === -1 && lastItem === '') {
                        lastItem = 99999999999999999999;
                    }
                    else if (lastItem === '') {
                        lastItem = -1;
                    }
                }
                else {
                    lastItem = (direction === -1 && lastItem === '') ? 'zzzzzzzzzzzzzzzzzzzzzzzzzzzzzz' : lastItem;
                }
                query[field] = {};
                query[field][direction === 1 ? '$gt' : '$lt'] = lastItem;
            }
            let sort = {};
            sort[field] = direction;

            let counts;
            if (category && category !== 'undefined' && category !== 'null') {
                category = category.split(',');
                counts = {};
                for (let i = 0; i < category.length; i++) {
                    category[i] = category[i] === 'collection' ? 'movies' : category[i];
                    let num = category[i];
                    counts[num] = (counts[num] || 0) + 1;
                }
            }

            if (id && id !== 'undefined' && id !== 'null' && typeof category !== 'string' && counts.all !== category.length) {
                User.findById(id, function (err, populatedUser) {
                    query['$and'] = [];
                    for (let i = 0; i < category.length; i++) {
                        if (category[i] !== 'all') {
                            if (category[i] !== 'unseen') {
                                query['$and'].push({
                                    '_id': {$in: populatedUser[category[i]]}
                                });
                            }
                            else {
                                query['$and'].push({
                                    '_id': {$nin: populatedUser.seen}
                                });
                            }
                        }
                    }
                    Movie.find(query)
                        .sort(sort)
                        .limit(20)
                        .populate(populateQuery)
                        .exec(function (err, movies) {
                            res.send(movies);
                        });
                });
            }
            else {
                Movie.find(query)
                    .sort(sort)
                    .limit(20)
                    .populate(populateQuery)
                    .exec(function (err, movies) {
                        res.send(movies);
                    });
            }
        },
        names (req, res) {
            let title = req.query.title;
            let genre = req.query.genre;
            let category = req.query.category;
            let id = req.query.id;
            let query = {};
            if (genre) {
                query.genre = genre;
            }
            if (title) {
                query.title = new RegExp(common.escapeRegex(title), 'gi');
            }

            let counts;
            if (category && category !== 'undefined' && category !== 'null') {
                category = category.split(',');
                counts = {};
                for (let i = 0; i < category.length; i++) {
                    category[i] = category[i] === 'collection' ? 'movies' : category[i];
                    let num = category[i];
                    counts[num] = (counts[num] || 0) + 1;
                }
            }

            if (id && id !== 'undefined' && id !== 'null' && typeof category !== 'string' && counts.all !== category.length) {
                User.findById(id, function (err, populatedUser) {
                    query['$and'] = [];
                    for (let i = 0; i < category.length; i++) {
                        if (category[i] !== 'all') {
                            if (category[i] !== 'unseen') {
                                query['$and'].push({
                                    '_id': {$in: populatedUser[category[i]]}
                                });
                            }
                            else {
                                query['$and'].push({
                                    '_id': {$nin: populatedUser.seen}
                                });
                            }
                        }
                    }
                    Movie.find(query, 'title')
                        .sort([['title', 1], ['rating', -1]])
                        .limit(20)
                        .exec(function (err, movies) {
                            movies = movies.map(movie => movie.title);
                            res.send(movies);
                        });
                });
            }
            else {
                Movie.find(query, 'title')
                    .sort([['title', 1], ['rating', -1]])
                    .limit(20)
                    .exec(function (err, movies) {
                        movies = movies.map(movie => movie.title);
                        res.send(movies);
                    });
            }
        }
    },
    put: {
        trailer(req, res){
            let id = req.query.id;
            let trailer = req.query.url;

            Movie.findByIdAndUpdate(id, {trailer}, {new: true}, function (err, model) {
                res.send(model);
            });
        }
    }
};