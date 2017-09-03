/**
 * Created by jafari on 12/23/2016 AD.
 */
import alt from '../alt';
import MovieActions from '../actions/MovieActions';
import AppActions from '../actions/AppActions';

class MovieStore {
    constructor() {
        this.bindActions(MovieActions);
        this.movie = {};
    }

    onGetMovieSuccess(data) {
        this.movie = data;
        AppActions.loading.defer();
    }

    onSetVideoSuccess(url) {
        this.movie.trailer = url;
    }

    onSaveTrailerSuccess(){

    }
}

export default alt.createStore(MovieStore);