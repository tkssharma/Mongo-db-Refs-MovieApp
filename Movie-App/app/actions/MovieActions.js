/**
 * Created by jafari on 12/23/2016 AD.
 */
import alt from '../alt';
import AppActions from '../actions/AppActions';

class MovieActions {
    constructor() {
        this.generateActions(
            'getMovieSuccess',
            'saveTrailerSuccess',
            'setVideoSuccess'
        );
    }

    getMovie(id){
        var that = this;
        am.ajax({
            url: '/api/movie/info',
            dataType: 'json',
            method: 'GET',
            data: {id},
            success(data) {
                that.getMovieSuccess(data);
            },
            fail() {
                that.getMovie(id);
            }
        });
        return true;
    }

    saveTrailer(id,url){
        var that = this;
        am.ajax({
            url: '/api/movie/trailer',
            dataType: 'json',
            method: 'PUT',
            data: {url,id},
            success() {
                that.saveTrailerSuccess();
            }
        });
        return true;
    }

    setVideo(url){
        return this.setVideoSuccess(url);
    }
}

export default alt.createActions(MovieActions);