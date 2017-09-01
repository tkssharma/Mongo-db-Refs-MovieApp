/**
 * Created by jafari on 12/23/2016 AD.
 */
import React from 'react';
import {browserHistory, Link} from 'react-router';
import alt from '../alt';

import AppStore from '../stores/AppStore'
import AppActions from '../actions/AppActions';

import Toolbar from 'react-md/lib/Toolbars';
import Button from 'react-md/lib/Buttons/Button';
import MenuButton from 'react-md/lib/Menus/MenuButton';
import ListItem from 'react-md/lib/Lists/ListItem';
import Snackbar from 'react-md/lib/Snackbars';
import CircularProgress from 'react-md/lib/Progress/CircularProgress';
import Drawer from 'react-md/lib/Drawers';

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = AppStore.getState();
        this.onChange = this.onChange.bind(this);
        this.removeToast = this.removeToast.bind(this);
    }

    componentDidMount() {
        AppStore.listen(this.onChange);
        if (this.state.userCredential && this.state.userCredential.id) {
            AppActions.getInfo.defer(this.state.userCredential.id);
        }
    }

    componentWillUnmount() {
        AppStore.unlisten(this.onChange);
        alt.recycle(AppStore);
    }

    onChange(state) {
        const credential = JSON.stringify(this.state.userCredential);
        this.setState(state, () => {
            if (credential !== JSON.stringify(this.state.userCredential)) {
                if (!this.state.userCredential || !this.state.userCredential.id) {
                    browserHistory.push('/login');
                    AppActions.clearInfo.defer();
                }
                else {
                    browserHistory.push('/');
                    AppActions.getInfo.defer(this.state.userCredential.id);
                }
            }
        });
    }

    logout() {
        AppActions.addToast.defer('Logged out!');
        AppActions.logout.defer();
    }

    removeToast() {
        const [, ...toasts] = this.state.toasts;
        AppActions.toastState.defer(toasts);
    }

    toggleDrawer() {
        AppActions.toggleDrawer.defer();
    }

    render() {
        const nav = <Button key="nav" icon onClick={this.toggleDrawer}>menu</Button>;
        let list = [];
        if (this.state.userCredential && this.state.userCredential.username) {
            list = [<ListItem key="logout" primaryText="Logout" onClick={this.logout}/>];
        }
        else {
            list = [<Link key="login-link"
                          to="/login"><ListItem key="login" primaryText="Login"/></Link>];
        }
        const actions = [
            <MenuButton id="user"
                        icon
                        buttonChildren="person"
                        children={list}
                        position="tr"/>
        ];
        const drawerList = [
            <Link to="/" activeClassName="drawer-active" key="home">
                <ListItem primaryText="Home"/>
            </Link>,
            <Link to="/collection" activeClassName="drawer-active" key="collection">
                <ListItem primaryText="Collection"/>
            </Link>,
            <Link to="/wishlist" activeClassName="drawer-active" key="wishlist">
                <ListItem primaryText="Wishlist"/>
            </Link>,
            <Link to="/actors-list" activeClassName="drawer-active" key="actors-list">
                <ListItem primaryText="Actors"/>
            </Link>,
            <Link to="/directors-list" activeClassName="drawer-active" key="directors-list">
                <ListItem primaryText="Directors"/>
            </Link>,
            <Link to="/writers-list" activeClassName="drawer-active" key="writers-list">
                <ListItem primaryText="Writers"/>
            </Link>,
            <Link to="/movies-list" activeClassName="drawer-active" key="movies-list">
                <ListItem primaryText="Movies"/>
            </Link>,
            <Link to="/genres-list" activeClassName="drawer-active" key="genres-list">
                <ListItem primaryText="Genres"/>
            </Link>
        ];
        const drawerHeader = <h3 style={{textAlign: 'center', margin: '32px auto'}}>MPMovieCollection</h3>;
        return (
            <div className="page-container">
                <Toolbar
                    themed
                    title={(this.state.userCredential && this.state.userCredential.username) ? `${this.state.userCredential.username.toUpperCase()}'s Movie Collection` : 'My Personal Movie Collection'}
                    nav={nav}
                    actions={actions}
                    className="toolbar"
                />
                {React.cloneElement(this.props.children, {
                    userCredential: this.state.userCredential,
                    wishlist: this.state.wishlist,
                    collection: this.state.collection,
                    seen: this.state.seen,
                    liked: this.state.liked,
                    disliked: this.state.disliked
                })}
                <Snackbar className={this.state.toastClass} toasts={this.state.toasts} autohide
                          onDismiss={this.removeToast}/>
                {
                    this.state.loading ?
                        <div className="loading">
                            <div className="loading-holder">
                                <CircularProgress key="loading" scale={5} id="loading"/>
                                <p>{this.state.loadingText || 'Loading...'}</p>
                            </div>
                        </div>
                        :
                        null
                }
                <Drawer
                    visible={this.state.drawer}
                    position="left"
                    navItems={drawerList}
                    onVisibilityToggle={this.toggleDrawer}
                    type={Drawer.DrawerTypes.TEMPORARY}
                    header={drawerHeader}
                    style={{zIndex: 99999999999}}
                />
            </div>
        );
    }
}

export default App;