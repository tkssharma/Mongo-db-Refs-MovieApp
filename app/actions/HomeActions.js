/**
 * Created by jafari on 12/23/2016 AD.
 */
import alt from '../alt';
import AppActions from '../actions/AppActions';

class HomeActions {
    constructor() {
        this.generateActions(
            'collectFail',
            'collectSuccess',
            'getMoviesFail',
            'getMoviesSuccess',
            'loadMovieFail',
            'loadMovieSuccess',
            'resetAutocompleteSuccess',
            'searchIMDBFail',
            'searchIMDBSuccess'
        );
    }

    getMovies(title) {
        var that = this;
        am.ajax({
            url: '/api/movie/names',
            dataType: 'json',
            method: 'GET',
            data:{title},
            success(data) {
                that.getMoviesSuccess(data);
            },
            fail(xmlhttp, status, responseText) {
                that.getMoviesFail(responseText);
            }
        });
        return true;
    }

    loadMovie(movieName) {
        var that = this;
        AppActions.loading.defer(true,'Loading the movie...');
        am.ajax({
            url: '/api/movie',
            dataType: 'json',
            method: 'GET',
            data: {movieName},
            success(data) {
                that.loadMovieSuccess(data);
            },
            fail(xmlhttp, status, responseText) {
                that.loadMovieFail(responseText);
            }
        });
        return true;
    }

    resetAutocomplete(){
        return this.resetAutocompleteSuccess();
    }

    searchIMDB(movieName) {
        var that = this;
        AppActions.loading.defer(true,'Loading the movie...');
        am.ajax({
            url: '/api/movie/imdb',
            dataType: 'json',
            method: 'GET',
            data: {movieName},
            success(data) {
                if(!data.Response){
                    that.searchIMDBSuccess(data);
                }
                else{
                    that.searchIMDBFail(data.Error);
                }
            },
            fail() {
                that.searchIMDBFail('An error occurred, please try again later!');
            }
        });
        return true;
    }
}

export default alt.createActions(HomeActions);