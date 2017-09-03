/**
 * Created by amin on 2/1/17.
 */
let User = require('../../models/user');
let Movie = require('../../models/movie');

let createGenresArray = function (movies) {
    let genres = [];
    for (let i = 0; i < movies.length; i++) {
        let movieGenre = movies[i].genre;
        for (let j = 0; j < movieGenre.length; j++) {
            let genreIndex = genres.map(item => item.name).indexOf(movieGenre[j]);
            if (genreIndex === -1) {
                genres.push({
                    name: movieGenre[j],
                    movies: [movies[i].poster],
                    count: 1
                });
            }
            else if (genres[genreIndex].movies.length !== 5) {
                genres[genreIndex].movies.push(movies[i].poster);
                genres[genreIndex].count++;
            }
            else {
                genres[genreIndex].count++;
            }
        }
    }
    return genres;
};

module.exports = {
    get: {
        list (req, res) {
            let id = req.query.id;
            let category = req.query.category;
            if (id === 'null' || id === 'undefined' || category === 'all') {
                Movie.find({}, 'genre poster', {sort: {rating: -1}}, function (err, movies) {
                    let genres = createGenresArray(movies);
                    res.send(genres);
                });
            }
            else {
                let populateQuery = [{
                    path: category,
                    select: 'genre poster',
                    options: {sort: {rating: -1}}
                }];

                User.findById(id)
                    .populate(populateQuery)
                    .exec(function (err, populatedUser) {
                        let genres = createGenresArray(populatedUser[category]);
                        res.send(genres);
                    });
            }
        }
    }
};