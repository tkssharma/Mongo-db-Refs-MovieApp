/**
 * Created by amin on 2/1/17.
 */
let async = require('async');
let User = require('../../models/user');
let Movie = require('../../models/movie');

module.exports = {
    post: {
        authentication (req, res, next) {
            let username = req.body.username;
            let password = req.body.password;
            let foundUser;

            async.waterfall([
                function (callback) {
                    User.findOne({username: username.toLowerCase()}, function (err, user) {
                        if (err) return next(err);

                        if (user && user.password !== password) {
                            return res.status(409).send({message: `Wrong password for ${user.username.toUpperCase()}!`});
                        }

                        foundUser = user;

                        callback(err);
                    });
                },
                function () {
                    if (foundUser && foundUser.password === password) {
                        res.send({
                            username: foundUser.username,
                            id: foundUser._id
                        });
                    }
                    else {
                        let newUser = new User({
                            username: username.toLowerCase(),
                            password: password
                        });

                        newUser.save(function (err, addedUser) {
                            if (err) return next(err);
                            res.send({
                                username: username,
                                id: addedUser._id
                            });
                        });
                    }
                }
            ]);
        },
        collect (req, res) {
            let id = req.body.id;
            let userid = req.body.userid;
            User.findByIdAndUpdate(userid, {$push: {movies: id}, $pull: {wishlist: id}}, {new: true}, function () {
                Movie.findById(id, '_id title', function (err, movie) {
                    res.send(movie);
                });
            });
        },
        dislike (req, res) {
            let id = req.body.id;
            let userid = req.body.userid;
            User.findByIdAndUpdate(userid, {
                $push: {disliked: id},
                $pull: {liked: id}
            }, {new: true}, function () {
                Movie.findById(id, '_id title', function (err, populated) {
                    res.send(populated);
                });
            })
        },
        like (req, res) {
            let id = req.body.id;
            let userid = req.body.userid;
            User.findByIdAndUpdate(userid, {
                $push: {liked: id},
                $pull: {disliked: id}
            }, {new: true}, function () {
                Movie.findById(id, '_id title', function (err, populated) {
                    res.send(populated);
                });
            })
        },
        seen (req, res) {
            let id = req.body.id;
            let userid = req.body.userid;
            User.findByIdAndUpdate(userid, {$push: {seen: id}}, {new: true}, function () {
                Movie.findById(id, '_id title', function (err, populated) {
                    res.send(populated);
                });
            })
        },
        wishlist (req, res) {
            let id = req.body.id;
            let userid = req.body.userid;
            User.findByIdAndUpdate(userid, {$push: {wishlist: id}}, {new: true}, function () {
                Movie.findById(id, '_id title', function (err, populated) {
                    res.send(populated);
                });
            })
        }
    },
    get: {
        info (req, res) {
            let id = req.query.id;
            let populateQuery = [{
                path: 'wishlist',
                select: '_id title',
                options: {sort: {'title': 1}}
            }, {
                path: 'movies',
                select: '_id title',
                options: {sort: {'title': 1}}
            }, {
                path: 'seen',
                select: '_id title'
            }, {
                path: 'liked',
                select: '_id title'
            }, {
                path: 'disliked',
                select: '_id title'
            }];

            User.findById(id)
                .populate(populateQuery)
                .exec(function (err, populatedUser) {
                    res.send({
                        wishlist: populatedUser.wishlist,
                        collection: populatedUser.movies,
                        seen: populatedUser.seen,
                        liked: populatedUser.liked,
                        disliked: populatedUser.disliked
                    });
                });
        }
    },
    delete: {
        collect (req, res) {
            let id = req.query.id;
            let userid = req.query.userid;
            User.findByIdAndUpdate(userid, {$pull: {movies: id}}, {new: true}, function () {
                res.send();
            });
        },
        dislike (req, res) {
            let id = req.query.id;
            let userid = req.query.userid;
            User.findByIdAndUpdate(userid, {$pull: {disliked: id}}, {new: true}, function () {
                res.send();
            });
        },
        like (req, res) {
            let id = req.query.id;
            let userid = req.query.userid;
            User.findByIdAndUpdate(userid, {$pull: {liked: id}}, {new: true}, function () {
                res.send();
            });
        },
        seen (req, res) {
            let id = req.query.id;
            let userid = req.query.userid;
            User.findByIdAndUpdate(userid, {$pull: {seen: id}}, {new: true}, function () {
                res.send();
            });
        },
        wishlist (req, res) {
            let id = req.query.id;
            let userid = req.query.userid;
            User.findByIdAndUpdate(userid, {$pull: {wishlist: id}}, {new: true}, function () {
                res.send();
            });
        }
    }
};