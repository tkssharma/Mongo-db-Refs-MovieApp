/**
 * Created by jafari on 12/23/2016 AD.
 */
import alt from '../alt';
import PersonPageActions from '../actions/PersonActions';
import AppActions from '../actions/AppActions';

class PersonPageStore {
    constructor() {
        this.bindActions(PersonPageActions);
        this.person={};
        this.userMovies=[];
        this.downloadingImage=false;
    }

    onDownloadingImageSuccess(){
        this.downloadingImage=true;
    }

    onGetPersonInfoSuccess(data){
        this.person.summary=data;
    }

    onGetPersonSuccess(databack){
        var data=databack[0];
        var type=databack[1];

        this.person=data.person;
        this.userMovies=data.userMovies;
        AppActions.loading.defer();
        if(!data.person.summary){
            PersonPageActions.getPersonInfo.defer(data.person.name,data.person._id,type);
        }
    }

    onGetImageSuccess(data){
        this.person.image=data+'?'+new Date;
        this.downloadingImage=false;
    }
}

export default alt.createStore(PersonPageStore);