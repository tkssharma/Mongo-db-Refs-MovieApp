/**
 * Created by amin on 2/1/17.
 */
let fs = require('fs');
let request = require('request');
let config = require('../config');
let Movie = require('../models/movie');
let Actor = require('../models/actor');
let Director = require('../models/director');
let Writer = require('../models/writer');

let Person = {
    actors: {
        model: Actor
    },
    directors: {
        model: Director
    },
    writers: {
        model: Writer
    }
};

function setMoviesCount(type, callback) {
    Person[type].model.find({}, function (err, people) {
        let length = people.length;

        function addCount(index) {
            Person[type].model.update({_id: people[index]._id}, {movies_count: people[index].movies.length}, function () {
                console.log(people[index].name);
                index++;
                if (index < length) {
                    addCount(index);
                }
                else {
                    console.log('finished');
                    if (callback) {
                        callback();
                    }
                }
            });
        }

        addCount(0);
    })
}

function setCountRef(type, callback) {
    Person[type].model.find({}).sort({movies_count: -1}).exec(function (err, people) {
        let length = people.length;

        function addCount(index) {
            Person[type].model.update({_id: people[index]._id}, {count_ref: index}, function () {
                console.log(people[index].name);
                index++;
                if (index < length) {
                    addCount(index);
                }
                else {
                    console.log('finished');
                    if (callback) {
                        callback();
                    }
                }
            });
        }

        addCount(0);
    })
}

function setRatingRef(callback) {
    Movie.find({}).sort({rating: 1}).exec(function (err, movies) {
        let length = movies.length;

        function addCount(index) {
            Movie.update({_id: movies[index]._id}, {rating_ref: index}, function () {
                console.log(movies[index].title);
                index++;
                if (index < length) {
                    addCount(index);
                }
                else {
                    console.log('finished');
                    if (callback) {
                        callback();
                    }
                }
            });
        }

        addCount(0);
    })
}

function setYearRef(callback) {
    Movie.find({}).sort({year: 1}).exec(function (err, movies) {
        let length = movies.length;

        function addCount(index) {
            Movie.update({_id: movies[index]._id}, {year_ref: index}, function () {
                console.log(movies[index].title);
                index++;
                if (index < length) {
                    addCount(index);
                }
                else {
                    console.log('finished');
                    if (callback) {
                        callback();
                    }
                }
            });
        }

        addCount(0);
    })
}

module.exports = {
    updateDataRefs() {
        setMoviesCount('actors', () => {
            setCountRef('actors')
        });
        setMoviesCount('directors', () => {
            setCountRef('directors')
        });
        setMoviesCount('writers', () => {
            setCountRef('writers')
        });
        setRatingRef();
        setYearRef();
    },
    escapeRegex (text) {
        return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
    },
    addImageName() {
        Person.actors.model.find({}, 'name')
            .sort([['name', 1]])
            .exec(function (err, persons) {
                if (err) return next(err);
                let imageName;
                for (let person of persons) {
                    imageName = config.imageURL + person.name.replace(/[^a-z0-9]/gi, '_') + '.jpg';
                    if (fs.existsSync(imageName)) {
                        Actor.findOneAndUpdate(
                            {name: person.name},
                            {image: imageName},
                            {
                                upsert: true,
                                new: true
                            }, function () {
                                console.log(person.name);
                            });
                    }
                }
            });
    },
    download (uri, filename, callback, errorHandler) {
        request.head(uri, function (err, res) {
            if (!err && res && res.statusCode === 200) {
                request(uri).on('error', function () {
                    res.emit('end');
                    errorHandler();
                }).pipe(fs.createWriteStream(filename)).on('close', callback || function () {
                    });
            }
            else if (errorHandler) {
                errorHandler();
            }
        });
    },
    Person
};