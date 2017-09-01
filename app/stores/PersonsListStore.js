/**
 * Created by jafari on 12/23/2016 AD.
 */
import alt from '../alt';
import PersonsListActions from '../actions/PersonsListActions';

class PersonsListStore {
    constructor() {
        this.bindActions(PersonsListActions);
        this.personsList=[];
        this.personsNames=[];
        this.allResultsLoaded=false;
        this.lazyLoading=false;
        this.options = {
            lastItem: '',
            field: 'count_ref',
            direction: 1,
            search:''
        };
        this.searchLoading=false;
        this.searchValue='';
    }

    onGetPersonsListSuccess(data){
        this.personsList.push(...data);
        this.lazyLoading=false;
        this.searchLoading=false;
        if (data.length) {
            this.options.lastItem = data[data.length - 1].count_ref;
        }
        else{
            this.allResultsLoaded=true;
        }
    }

    onGetPersonsNamesSuccess(data){
        this.personsNames=[...new Set(data)];
    }

    onLazyLoadingSuccess(loading){
        this.lazyLoading=loading;
    }

    onSearchLoading(loading){
        this.searchLoading=loading;
    }

    onSearchSuccess(keyword){
        this.options.search=keyword;
        this.options.lastItem='';
        this.allResultsLoaded=false;
        this.personsList=[];
    }
}

export default alt.createStore(PersonsListStore);