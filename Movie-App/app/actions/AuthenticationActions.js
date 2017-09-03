/**
 * Created by jafari on 12/23/2016 AD.
 */
import alt from '../alt';

class AuthenticationActions {
    constructor() {
        this.generateActions(
            'invalidPasswordLog',
            'invalidUsernameLog',
            'loginFail',
            'loginSuccess',
            'updatePassword',
            'updateUsername'
        );
    }

    invalidPassword() {
        return this.invalidPasswordLog('Please provide a password!');
    }

    invalidUsername() {
        return this.invalidUsernameLog('Please provide a username!');
    }

    login(username, password) {
        var that = this;
        am.ajax({
            url: '/api/authentication',
            dataType: 'json',
            data: {
                username: username,
                password: password
            },
            success(data) {
                that.loginSuccess(data);
            },
            fail(xmlhttp, status, responseText) {
                that.loginFail(responseText);
            }
        });
        return true;
    }
}

export default alt.createActions(AuthenticationActions);