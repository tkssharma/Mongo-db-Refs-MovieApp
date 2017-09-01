/**
 * Created by jafari on 12/23/2016 AD.
 */
import alt from '../alt';

class GenresListActions {
    constructor() {
        this.generateActions(
            'getGenresListSuccess',
            'categoryChangeSuccess',
            'toggleSettingsSuccess'
        );
    }

    getGenresList(id,category){
        var that = this;
        am.ajax({
            url: '/api/genre/list',
            dataType: 'json',
            method: 'GET',
            data:{id,category},
            success(data) {
                that.getGenresListSuccess(data);
            },
            fail() {
                that.getGenresList(id,category);
            }
        });
        return true;
    }

    categoryChange(value){
        return this.categoryChangeSuccess(value);
    }

    toggleSettings(){
        return this.toggleSettingsSuccess();
    }
}

export default alt.createActions(GenresListActions);