/**
 * Created by jafari on 12/23/2016 AD.
 */
import alt from '../alt';
import GenresListActions from '../actions/GenresListActions';

class GenresListStore {
    constructor() {
        this.bindActions(GenresListActions);
        this.genresList = [];
        this.category='all';
        this.settings = false;
        this.currentCategory='all';
    }

    onCategoryChangeSuccess(value){
        this.category=value;
        this.genresList=[];
    }

    onGetGenresListSuccess(data) {
        this.genresList=data;
    }

    onToggleSettingsSuccess(){
        this.settings=!this.settings;
    }
}

export default alt.createStore(GenresListStore);