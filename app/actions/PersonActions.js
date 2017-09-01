/**
 * Created by jafari on 12/23/2016 AD.
 */
import alt from '../alt';

class PersonPageActions {
    constructor() {
        this.generateActions(
            'downloadingImageSuccess',
            'getPersonSuccess',
            'getPersonInfoSuccess',
            'getImageSuccess'
        );
    }

    downloadingImage(){
        return this.downloadingImageSuccess();
    }

    getPerson(id,userid,type){
        var that = this;
        am.ajax({
            url: '/api/person',
            dataType: 'json',
            method: 'GET',
            data: {id,userid,type},
            success(data) {
                that.getPersonSuccess(data,type);
            },
            fail() {
                that.getPerson(id,userid,type);
            }
        });
        return true;
    }

    getPersonInfo(name,id,type){
        var that = this;
        am.ajax({
            url: '/api/person/info',
            method: 'GET',
            data: {id,name,type},
            success(data) {
                that.getPersonInfoSuccess(data);
            },
            fail() {
                that.getPersonInfo(name,id,type);
            }
        });
        return true;
    }

    getImage(id,type){
        var that = this;
        am.ajax({
            url: '/api/person/image',
            dataType: 'json',
            method: 'GET',
            data: {id,type},
            success(data) {
                that.getImageSuccess(data);
            },
            fail() {
                that.getImage(id,type);
            }
        });
        return true;
    }
}

export default alt.createActions(PersonPageActions);