/**
 * Created by jafari on 12/23/2016 AD.
 */
import React from 'react';
import alt from '../alt';

import AuthenticationStore from '../stores/AuthenticationStore'
import AuthenticationActions from '../actions/AuthenticationActions';
import AppActions from '../actions/AppActions';

import {Card, CardTitle, CardText, CardActions} from 'react-md/lib/Cards';
import TextField from 'react-md/lib/TextFields';
import Button from 'react-md/lib/Buttons/Button';

class Authentication extends React.Component {

    constructor(props) {
        super(props);
        this.state = AuthenticationStore.getState();
        this.onChange = this.onChange.bind(this);
        this.login = this.login.bind(this);
    }

    componentDidMount() {
        AuthenticationStore.listen(this.onChange);
    }

    componentWillUnmount() {
        AuthenticationStore.unlisten(this.onChange);
        alt.recycle(AuthenticationStore);
    }

    onChange(state) {
        const credential=JSON.stringify(this.state.userCredential);
        this.setState(state, ()=> {
            if (this.state.userCredential.id && credential!==JSON.stringify(this.state.userCredential)) {
                AppActions.addToast.defer(`Logged in as ${this.state.userCredential.username.toUpperCase()}!`, 'success');
                AppActions.authenticate.defer(this.state.userCredential);
            }
        });
    }

    login(event) {
        event.preventDefault();

        var username = this.state.username.trim();
        var password = this.state.password;

        if (!username) {
            AuthenticationActions.invalidUsername();
        }

        if (!password) {
            AuthenticationActions.invalidPassword();
        }

        if (username && password) {
            AuthenticationActions.login(username, password)
        }
    }

    render() {
        return (
            <Card className="login-box">
                <CardTitle title="Login / Signup"/>
                <CardText>
                    <TextField id="username" label="Username"
                               value={this.state.username}
                               onChange={AuthenticationActions.updateUsername}
                               ref="username"
                               autoFocus/>
                    <TextField id="password" label="Password" type="password"
                               value={this.state.password}
                               onChange={AuthenticationActions.updatePassword}
                               ref="password"/>
                </CardText>
                <CardActions>
                    <Button flat primary label="Login or Signup" onClick={this.login}/>
                </CardActions>
            </Card>
        );
    }
}

export default Authentication;