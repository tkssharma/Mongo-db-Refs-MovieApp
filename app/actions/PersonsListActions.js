/**
 * Created by jafari on 12/23/2016 AD.
 */
import alt from '../alt';
import AppActions from '../actions/AppActions';

class PersonsListActions {
    constructor() {
        this.generateActions(
            'getPersonsListSuccess',
            'getPersonsNamesSuccess',
            'lazyLoadingSuccess',
            'searchLoadingSuccess',
            'searchSuccess'
        );
    }

    getPersonsList(id,options,type){
        this.lazyLoading(true);
        var that = this;
        am.ajax({
            url: '/api/person/list',
            dataType: 'json',
            method: 'GET',
            data: {
                id:id,
                lastItem:options.lastItem,
                field:options.field,
                search:options.search,
                direction:options.direction,
                type:type
            },
            success(data) {
                that.getPersonsListSuccess(data);
            },
            fail() {
                that.getPersonsList(id,options,type);
            }
        });
        return true;
    }

    getPersonsNames(type,name){
        var that = this;
        am.ajax({
            url: '/api/person/names',
            dataType: 'json',
            method: 'GET',
            data:{type,name},
            success(data) {
                that.getPersonsNamesSuccess(data);
            },
            fail() {
                that.getPersonsNames(type,name);
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
}

export default alt.createActions(PersonsListActions);