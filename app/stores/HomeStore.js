/**
 * Created by jafari on 12/23/2016 AD.
 */
import alt from '../alt';
import HomeActions from '../actions/HomeActions';
import AppActions from '../actions/AppActions';

class HomeStore {
    constructor() {
        this.bindActions(HomeActions);
        this.foundMovie={};
        this.moviesNames=[];
    }

    onGetMoviesFail(){
        AppActions.loading.defer();
        AppActions.addToast.defer('Couldn\'t load the movie names, autocomplete may not work!', 'error');
    }

    onGetMoviesSuccess(data){
        this.moviesNames=[...new Set(data)];
    }

    onLoadMovieFail(){
        AppActions.loading.defer();
        AppActions.addToast.defer('An error occurred, please try again later!', 'error');
        this.foundMovie={};
    }

    onLoadMovieSuccess(data){
        AppActions.loading.defer();
        this.foundMovie=data;
    }

    onResetAutocompleteSuccess(){
        this.moviesNames=[];
    }

    onSearchIMDBFail(message){
        AppActions.loading.defer();
        AppActions.addToast.defer(message, 'error');
        this.foundMovie={};
    }

    onSearchIMDBSuccess(data){
        AppActions.loading.defer();
        this.foundMovie=data;
    }
}

export default alt.createStore(HomeStore);