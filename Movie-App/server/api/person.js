/**
 * Created by amin on 2/1/17.
 */
let fs = require('fs');
let request = require('request');
let async = require('async');
let config = require('../../config');
let common = require('../common');
let User = require('../../models/user');

let downloadImage=function (count,parsedResponse,imageName,type,id,res) {
    if (parsedResponse.data && parsedResponse.data.images && parsedResponse.data.images[count]) {
        common.download(parsedResponse.data.images[count].image_url, imageName, function () {
            common.Person[type].model.update({_id: id}, {image: imageName}, function () {
                res.send(imageName);
            });
        }, function () {
            count++;
            downloadImage(count);
        });
    }
    else {
        res.status(404).send();
    }
};
let getImageFromWikipedia=function (name,id,res,next,type,imageName,fallback) {
    request.get('http://en.wikipedia.org/w/api.php?action=query&format=json&maxlag=5&prop=pageimages&titles=' + encodeURIComponent(name) + '&redirects=1&piprop=thumbnail&pithumbsize=300', function (err, requestContent, response) {
        if (err) return next(err);
        let parsedResponse;
        try {
            parsedResponse = JSON.parse(response);
        }
        catch (error) {
            console.log(error);
            res.send();
            return false;
        }

        let page;
        if (parsedResponse.query && parsedResponse.query.pages) {
            page = Object.keys(parsedResponse.query.pages)[0];
        }

        if (parsedResponse.query && parsedResponse.query.pages && page != '-1' && parsedResponse.query.pages[page].thumbnail && parsedResponse.query.pages[page].thumbnail.source) {
            common.download(parsedResponse.query.pages[page].thumbnail.source, imageName, function () {
                common.Person[type].model.update({_id: id}, {image: imageName}, function () {
                    res.send(imageName);
                });
            }, function () {
                res.status(404).send();
            });
        }
        else {
            fallback();
        }
    });
};
let getImageFromGoogle=function (name,id,res,next,type,imageName) {
    request.get('http://theapache64.xyz:8080/gpix/v1/gpix?Authorization=zik5YbJUMN&keyword=' + encodeURIComponent(name) + '&limit=30', function (err, requestContent, response) {
        if (err) return next(err);
        let parsedResponse;
        try {
            parsedResponse = JSON.parse(response);
        }
        catch (error) {
            console.log(error);
            res.send();
            return false;
        }
        let count = 0;
        downloadImage(count,parsedResponse,imageName,type,id,res);
    }, function () {
        res.status(404).send();
    });
};

module.exports = {
    get: {
        person (req, res) {
            let id = req.query.id;
            let type = req.query.type;
            let userid = req.query.userid;
            let populateQuery = [{
                path: 'movies',
                select: '_id title poster year',
                options: {sort: {year: -1, rating: -1, title: 1}}
            }];

            common.Person[type].model.findById(id)
                .populate(populateQuery)
                .exec(function (err, populatedUser) {
                    if (userid !== 'null' && userid !== 'undefined') {
                        User.findById(userid)
                            .populate([{
                                path: 'movies',
                                select: '_id title poster year',
                                options: {sort: {title: 1, rating: -1}}
                            }])
                            .exec(function (err, foundUser) {
                                let userMovies = foundUser.movies.filter(item => populatedUser.movies.map(movie => movie.title).indexOf(item.title) > -1);
                                res.send({
                                    person: populatedUser,
                                    userMovies: userMovies
                                });
                            })
                    }
                    else {
                        res.send({
                            person: populatedUser,
                            userMovies: []
                        });
                    }
                });
        },
        image (req, res, next) {
            let id = req.query.id;
            let type = req.query.type;

            common.Person[type].model.findById(id, function (err, populatedUser) {
                let imageName = config.imageURL + populatedUser.name.replace(/[^a-z0-9]/gi, '_') + '.jpg';
                if (!fs.existsSync(imageName)) {
                    getImageFromWikipedia(populatedUser.name,id,res,next,type,imageName,function () {
                        getImageFromGoogle(populatedUser.name,id,res,next,type,imageName);
                    })
                }
                else {
                    res.send(populatedUser.name + ' Already Exists!');
                }
            });
        },
        info (req, res, next) {
            let id = req.query.id;
            let name = req.query.name;
            let type = req.query.type;
            request.get('http://en.wikipedia.org/w/api.php?action=query&format=json&maxlag=5&prop=extracts&titles=' + encodeURIComponent(name) + '&redirects=1&exintro=1&exsectionformat=plain', function (err, requestContent, response) {
                if (err) return next(err);
                let parsedResponse;
                try {
                    parsedResponse = JSON.parse(response);
                }
                catch (jsonError) {
                    console.log(jsonError);
                    res.send();
                    return false;
                }
                let pageKeys = Object.keys(parsedResponse.query.pages);
                let info = parsedResponse.query.pages[pageKeys[0]].extract;
                common.Person[type].model.findByIdAndUpdate(id, {summary: info}, {new: true}, function () {
                    res.send(info);
                });
            });
        },
        list (req, res) {
            let id = req.query.id;
            let type = req.query.type;
            let lastItem = req.query.lastItem !== '' ? req.query.lastItem : -1;
            let field = req.query.field;
            let search = req.query.search;
            let direction = parseInt(req.query.direction);
            let query = {};
            if (search.trim() !== '') {
                query.name = search;
            }
            else {
                query[field] = {};
                query[field][direction === 1 ? '$gt' : '$lt'] = lastItem;
            }
            let sort = {};
            sort[field] = direction;

            console.log(query);

            common.Person[type].model.find(query).sort(sort).limit(40).exec(function (err, allPersons) {
                if (id !== 'null' && id !== 'undefined') {
                    let populateQuery = [{
                        path: 'movies',
                        select: '_id ' + type,
                        populate: [{
                            path: type,
                            select: '_id name count_ref'
                        }]
                    }];
                    User.findById(id)
                        .populate(populateQuery)
                        .exec(function (err, populatedUser) {
                            let persons = JSON.parse(JSON.stringify(allPersons));
                            for (let i = 0; i < populatedUser.movies.length; i++) {
                                for (let j = 0; j < populatedUser.movies[i][type].length; j++) {
                                    if (persons.map(item => item.name).indexOf(populatedUser.movies[i][type][j].name) > -1) {
                                        if (persons[persons.map(item => item.name).indexOf(populatedUser.movies[i][type][j].name)].count) {
                                            persons[persons.map(item => item.name).indexOf(populatedUser.movies[i][type][j].name)].count++;
                                        }
                                        else {
                                            persons[persons.map(item => item.name).indexOf(populatedUser.movies[i][type][j].name)].count = 1;
                                        }
                                    }
                                }
                            }
                            res.send(persons);
                        });
                }
                else {
                    res.send(allPersons);
                }

            });
        },
        names (req, res, next) {
            let type = req.query.type;
            let name = req.query.name;
            let query = {};
            if (name) {
                query.name = new RegExp(common.escapeRegex(name), 'gi');
            }
            common.Person[type].model.find(query, 'name')
                .sort([['name', 1]])
                .limit(20)
                .exec(function (err, persons) {
                    if (err) return next(err);
                    persons = persons.map(person => person.name);
                    persons = persons.filter(person => person !== undefined);
                    res.send(persons);
                });
        }
    }
};