/**
 * Created by jafari on 12/23/2016 AD.
 */
import alt from '../alt';

class GenreActions {
    constructor() {
        this.generateActions(
            'categoryChangeSuccess',
            'filterLikedChangeSuccess',
            'filterSeenChangeSuccess',
            'getGenreSuccess',
            'getMoviesNamesSuccess',
            'lazyLoadingSuccess',
            'searchLoadingSuccess',
            'searchSuccess',
            'setCategorySuccess',
            'sortDirectionChangeSuccess',
            'sortFieldChangeSuccess',
            'toggleSettingsSuccess'
        );
    }

    categoryChange(value) {
        return this.categoryChangeSuccess(value);
    }

    filterLikedChange(value){
        return this.filterLikedChangeSuccess(value);
    }

    filterSeenChange(value){
        return this.filterSeenChangeSuccess(value);
    }

    getGenre(options, genre, id,category) {
        this.lazyLoading(true);
        var that = this;
        am.ajax({
            url: '/api/movie/list',
            dataType: 'json',
            method: 'GET',
            data: {
                lastItem: options.lastItem,
                field: options.field,
                direction: options.direction,
                search: options.search,
                genre: genre,
                category: category,
                id: id
            },
            success(data) {
                that.getGenreSuccess(data);
            },
            fail() {
                that.getGenre(options, genre, id, category);
            }
        });
        return true;
    }

    getMoviesNames(genre, id, category,title) {
        var that = this;
        am.ajax({
            url: '/api/movie/names',
            dataType: 'json',
            method: 'GET',
            data: {genre, category, id,title},
            success(data) {
                that.getMoviesNamesSuccess(data);
            },
            fail() {
                that.getMoviesNames(genre, id, category,title);
            }
        });
        return true;
    }

    lazyLoading(loading) {
        return this.lazyLoadingSuccess(loading);
    }

    search(keyword) {
        this.searchLoading(true);
        return this.searchSuccess(keyword);
    }

    searchLoading(loading) {
        return this.searchLoadingSuccess(loading);
    }

    setCategory(value){
        return this.setCategorySuccess(value);
    }

    sortDirectionChange(value) {
        return this.sortDirectionChangeSuccess(value);
    }

    sortFieldChange(value) {
        return this.sortFieldChangeSuccess(value);
    }

    toggleSettings() {
        return this.toggleSettingsSuccess();
    }
}

export default alt.createActions(GenreActions);