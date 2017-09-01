/**
 * Created by jafari on 12/23/2016 AD.
 */
import alt from '../alt';

class MoviesListActions {
    constructor() {
        this.generateActions(
            'filterLikedChangeSuccess',
            'filterSeenChangeSuccess',
            'getMoviesListSuccess',
            'getMoviesNamesSuccess',
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

    getMoviesList(options,id,category){
        this.lazyLoading(true);
        var that = this;
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
                category:category
            },
            success(data) {
                that.getMoviesListSuccess(data);
            },
            fail() {
                that.getMoviesList(options,id,category);
            }
        });
        return true;
    }

    getMoviesNames(id,category,title){
        var that = this;
        am.ajax({
            url: '/api/movie/names',
            dataType: 'json',
            method: 'GET',
            data:{id,category,title},
            success(data) {
                that.getMoviesNamesSuccess(data);
            },
            fail() {
                that.getMoviesNames(id,category,title);
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

    sortDirectionChange(value){
        return this.sortDirectionChangeSuccess(value);
    }

    sortFieldChange(value){
        return this.sortFieldChangeSuccess(value);
    }

    toggleSettings(){
        return this.toggleSettingsSuccess();
    }
}

export default alt.createActions(MoviesListActions);