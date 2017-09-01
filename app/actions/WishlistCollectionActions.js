/**
 * Created by jafari on 12/23/2016 AD.
 */
import alt from '../alt';

class WishlistCollectionActions {
    constructor() {
        this.generateActions(
            'filterLikedChangeSuccess',
            'filterSeenChangeSuccess',
            'getMoviesNamesSuccess',
            'getWishlistCollectionSuccess',
            'lazyLoadingSuccess',
            'searchLoadingSuccess',
            'searchSuccess',
            'sortDirectionChangeSuccess',
            'sortFieldChangeSuccess',
            'toggleSettingsSuccess'
        );
    }

    filterLikedChange(value){
        return this.filterLikedChangeSuccess(value);
    }

    filterSeenChange(value){
        return this.filterSeenChangeSuccess(value);
    }

    getWishlistCollection(id,options,type){
        var that = this;
        this.lazyLoading(true);
        am.ajax({
            url: '/api/movie/list',
            dataType: 'json',
            method: 'GET',
            data: {
                lastItem:options.lastItem,
                field:options.field,
                direction:options.direction,
                search:options.search,
                id:id,
                category:type
            },
            success(data) {
                that.getWishlistCollectionSuccess(data);
            },
            fail() {
                that.getWishlistCollection(id,options,type);
            }
        });
        return true;
    }

    getMoviesNames(id,category){
        var that = this;
        am.ajax({
            url: '/api/movie/names',
            dataType: 'json',
            method: 'GET',
            data:{id,category},
            success(data) {
                that.getMoviesNamesSuccess(data);
            },
            fail() {
                that.getMoviesNames(id,category);
            }
        });
        return true;
    }

    lazyLoading(loading){
        return this.lazyLoadingSuccess(loading);
    }

    search(keyword){
        this.searchLoading(true);
        return this.searchSuccess(keyword);
    }

    searchLoading(loading){
        return this.searchLoadingSuccess(loading);
    }

    toggleSettings(){
        return this.toggleSettingsSuccess();
    }

    sortDirectionChange(value){
        return this.sortDirectionChangeSuccess(value);
    }

    sortFieldChange(value){
        return this.sortFieldChangeSuccess(value);
    }
}

export default alt.createActions(WishlistCollectionActions);