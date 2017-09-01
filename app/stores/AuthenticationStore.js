/**
 * Created by jafari on 12/23/2016 AD.
 */
import alt from '../alt';
import AuthenticationActions from '../actions/AuthenticationActions';
import AppActions from '../actions/AppActions';

class AuthenticationStore {
    constructor() {
        this.bindActions(AuthenticationActions);
        this.password = '';
        this.userCredential = {};
        this.username = '';
    }

    onInvalidPasswordLog(message) {
        AppActions.addToast.defer(message, 'error');
    }

    onInvalidUsernameLog(message) {
        AppActions.addToast.defer(message, 'error');
    }

    onLoginFail(message) {
        try {
            AppActions.addToast.defer(JSON.parse(message).message, 'error');
        }
        catch (err) {
            AppActions.addToast.defer(message, 'error');
        }
    }

    onLoginSuccess(user) {
        am.cookie('MovieCollection_user', user, 30);
        this.userCredential = user;
    }

    onUpdatePassword(event) {
        this.password = event[0];
    }

    onUpdateUsername(event) {
        this.username = event[0];
    }
}

export default alt.createStore(AuthenticationStore);