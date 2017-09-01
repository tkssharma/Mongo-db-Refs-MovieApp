/**
 * Created by amin on 2/1/17.
 */
let fs = require('fs');
let Movie = require('../models/movie');
let Actor = require('../models/actor');
let Director = require('../models/director');
let Writer = require('../models/writer');
let config = require('../config');

module.exports = {
    api: {
        get: {
            people (req, res, next) {
                let query = {};
                Writer.find(query, '_id image')
                    .sort([['name', 1]])
                    .exec(function (err, persons) {
                        if (err) return next(err);
                        res.send(persons);
                    });
            },
            removeImage (req, res) {
                let imageName = req.query.image;
                if (fs.existsSync(imageName)) {
                    fs.unlink(imageName);
                }
                console.log(imageName);
                res.send();
            },
            emptyDB(){
                Actor.find({}).remove().exec();
                Director.find({}).remove().exec();
                Writer.find({}).remove().exec();
                Movie.find({}).remove().exec();
            }
        }
    },
    addImageName() {
        Writer.find({}, 'name')
            .sort([['name', 1]])
            .exec(function (err, persons) {
                if (err) return next(err);
                let imageName;
                for (let person of persons) {
                    imageName = config.imageURL + person.name.replace(/[^a-z0-9]/gi, '_') + '.jpg';
                    if (fs.existsSync(imageName)) {
                        Writer.findOneAndUpdate(
                            {name: person.name},
                            {image: imageName},
                            {
                                upsert: true,
                                new: true
                            }, function (err, actor) {
                                console.log(person.name);
                            });
                    }
                }
            });
    }
};