/**
 * Created by jafari on 12/23/2016 AD.
 */
import React from 'react';
import alt from '../alt';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

import HomeStore from '../stores/HomeStore';
import HomeActions from '../actions/HomeActions';
import MovieCard from './MovieCard';

import Autocomplete from 'react-md/lib/Autocompletes';

String.prototype.capitalize = function () {
    return this.charAt(0).toUpperCase() + this.slice(1);
};

class Home extends React.Component {

    constructor(props) {
        super(props);
        this.state = HomeStore.getState();
        this.onChange = this.onChange.bind(this);
        this.getMovie = this.getMovie.bind(this);
        this.getAutocompleteList = this.getAutocompleteList.bind(this);
    }

    componentDidMount() {
        HomeStore.listen(this.onChange);
    }

    componentWillUnmount() {
        HomeStore.unlisten(this.onChange);
        alt.recycle(HomeStore);
    }

    onChange(state) {
        this.setState(state);
    }

    getMovie(event) {
        let code = event.keyCode || event.which;
        if (code === 13 && event.target.value.trim() !== '') {
            let movieName = event.target.value;
            let foundMovie = this.state.moviesNames.filter(movie => movie.toLowerCase() === movieName.toLowerCase());
            if (foundMovie.length > 0) {
                HomeActions.loadMovie.defer(foundMovie[0]);
            }
            else {
                HomeActions.searchIMDB.defer(event.target.value);
            }
        }
    }

    getAutocompleteList(value) {
        if (this.autoCompleteThrottle) {
            clearTimeout(this.autoCompleteThrottle);
        }
        if (!value) {
            HomeActions.resetAutocomplete.defer();
            return;
        }
        this.autoCompleteThrottle = setTimeout(() => {
            HomeActions.getMovies.defer(value);
        }, 300);
    }

    render() {
        return (
            <div>
                <div className="holder">
                    <Autocomplete
                        id="moviesSearch"
                        label="Name of a movie"
                        data={this.state.moviesNames}
                        className="md-cell md-cell--8 movies-search"
                        filter={null}
                        onAutocomplete={HomeActions.loadMovie}
                        onChange={this.getAutocompleteList}
                        onKeyUp={this.getMovie}
                        customSize="title"
                        type="search"
                    />
                </div>
                <ReactCSSTransitionGroup
                    transitionName="animate"
                    transitionEnterTimeout={200}
                    transitionLeaveTimeout={200}>
                    {
                        this.state.foundMovie && this.state.foundMovie._id ?
                            <MovieCard data={[this.state.foundMovie]} userCredential={this.props.userCredential}
                                       collection={this.props.collection} wishlist={this.props.wishlist}
                                       seen={this.props.seen}
                                       liked={this.props.liked} disliked={this.props.disliked} expanded/>
                            : null
                    }
                </ReactCSSTransitionGroup>
            </div>
        );
    }
}

export default Home;