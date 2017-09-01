/**
 * Created by jafari on 12/23/2016 AD.
 */
import alt from '../alt';
import WishlistCollectionActions from '../actions/WishlistCollectionActions';

class WishlistCollectionStore {
    constructor() {
        this.bindActions(WishlistCollectionActions);
        this.allResultsLoaded=false;
        this.currentOptions={
            field:'title',
            direction:1,
            search:''
        };
        this.filterLiked='all';
        this.filterSeen='all';
        this.lazyLoading=false;
        this.options = {
            lastItem: '',
            field: 'title',
            direction: 1,
            search:''
        };
        this.searchLoading=false;
        this.searchValue='';
        this.settings = false;
        this.data=[];
        this.moviesNames=[];
    }

    onFilterLikedChangeSuccess(value){
        this.filterLiked=value;
        this.options.search='';
        this.options.lastItem='';
        this.allResultsLoaded=false;
        this.data=[];
    }

    onFilterSeenChangeSuccess(value){
        this.filterSeen=value;
        this.options.search='';
        this.options.lastItem='';
        this.allResultsLoaded=false;
        this.data=[];
    }

    onGetWishlistCollectionSuccess(data){
        this.data.push(...data);
        this.lazyLoading=false;
        this.searchLoading=false;
        if (data.length) {
            this.options.lastItem = data[data.length - 1][this.options.field + (this.options.field === 'rating' || this.options.field === 'year' ? '_ref' : '')];
        }
        else{
            this.allResultsLoaded=true;
        }
    }

    onGetMoviesNamesSuccess(data){
        this.moviesNames=[... new Set(data)];
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
        this.data=[];
    }

    onSortDirectionChangeSuccess(value){
        this.options.direction=parseInt(value);
        this.options.lastItem='';
        this.allResultsLoaded=false;
        this.data=[];
    }

    onSortFieldChangeSuccess(value){
        this.options.field=value;
        this.options.lastItem='';
        this.allResultsLoaded=false;
        this.data=[];
    }

    onToggleSettingsSuccess(){
        this.settings=!this.settings;
    }
}

export default alt.createStore(WishlistCollectionStore);