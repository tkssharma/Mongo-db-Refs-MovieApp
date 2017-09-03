/**
 * Created by jafari on 12/23/2016 AD.
 */
import React from 'react';
import {Route} from 'react-router';
import cookie from 'react-cookie';

import App from './components/App';
import Home from './components/Home';
import Authentication from './components/Authentication';
import WishlistCollection from './components/WishlistCollection';
import Person from './components/Person';
import Movie from './components/Movie';
import Genre from './components/Genre';
import PersonsList from './components/PersonsList';
import MoviesList from './components/MoviesList';
import GenresList from './components/GenresList';

const checkLogin = (nextState, replace) => {
    if (!cookie.load('MovieCollection_user')) {
        replace('/login');
    }
};

const sendHomeIfLoggedIn = (nextState, replace) => {
    if (cookie.load('MovieCollection_user')) {
        replace('/');
    }
};

export default (
    <Route component={App}>
        <Route path="/" component={Home}/>
        <Route path='/login' component={Authentication} onEnter={sendHomeIfLoggedIn}/>

        <Route path='/collection' component={WishlistCollection} onEnter={checkLogin}/>
        <Route path='/wishlist' component={WishlistCollection} onEnter={checkLogin}/>

        <Route path='/actors-list' component={PersonsList}/>
        <Route path='/directors-list' component={PersonsList}/>
        <Route path='/writers-list' component={PersonsList}/>
        <Route path='/movies-list' component={MoviesList}/>
        <Route path='/genres-list' component={GenresList}/>

        <Route path='/actors/:id/:name' component={Person}/>
        <Route path='/directors/:id/:name' component={Person}/>
        <Route path='/writers/:id/:name' component={Person}/>
        <Route path='/movies/:id/:name' component={Movie}/>
        <Route path='/genres/:name/:category' component={Genre}/>
    </Route>
);