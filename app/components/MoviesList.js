/**
 * Created by jafari on 12/23/2016 AD.
 */
import React from 'react';
import alt from '../alt';

import MoviesListStore from '../stores/MoviesListStore';
import MoviesListActions from '../actions/MoviesListActions';
import MovieCard from './MovieCard';
import Settings from './Settings';

import CircularProgress from 'react-md/lib/Progress/CircularProgress';
import Autocomplete from 'react-md/lib/Autocompletes';
import LinearProgress from 'react-md/lib/Progress/LinearProgress';

class MoviesList extends React.Component {

    constructor(props) {
        super(props);
        this.state = MoviesListStore.getState();
        this.onChange = this.onChange.bind(this);
        this.autocompleteChange = this.autocompleteChange.bind(this);
        this.getMovie = this.getMovie.bind(this);
        this.handleLazyLoad = this.handleLazyLoad.bind(this);
    }

    componentDidMount() {
        MoviesListStore.listen(this.onChange);
        MoviesListActions.getMoviesList.defer(this.state.options);
        window.addEventListener('scroll', this.handleLazyLoad);
    }

    componentWillUnmount() {
        MoviesListStore.unlisten(this.onChange);
        alt.recycle(MoviesListStore);
        window.removeEventListener('scroll', this.handleLazyLoad);
    }

    onChange(state) {
        let newSearch = state.options.search;
        let newField = state.options.field;
        let newDirection = state.options.direction;
        if (state.currentOptions.search !== newSearch) {
            state.currentOptions.search = newSearch;
            MoviesListActions.getMoviesList.defer(state.options,this.props.userCredential.id,[state.filterLiked,state.filterSeen]);
        }
        if (state.currentOptions.field !== newField) {
            state.currentOptions.field = newField;
            MoviesListActions.getMoviesList.defer(state.options,this.props.userCredential.id,[state.filterLiked,state.filterSeen]);
        }
        if (state.currentOptions.direction !== newDirection) {
            state.currentOptions.direction = newDirection;
            MoviesListActions.getMoviesList.defer(state.options,this.props.userCredential.id,[state.filterLiked,state.filterSeen]);
        }
        if (this.state.filterLiked!== state.filterLiked) {
            MoviesListActions.getMoviesList.defer(state.options,this.props.userCredential.id,[state.filterLiked,state.filterSeen]);
            MoviesListActions.getMoviesNames.defer(this.props.userCredential.id,[state.filterLiked,state.filterSeen]);
        }
        if (this.state.filterSeen!== state.filterSeen) {
            MoviesListActions.getMoviesList.defer(state.options,this.props.userCredential.id,[state.filterLiked,state.filterSeen]);
            MoviesListActions.getMoviesNames.defer(this.props.userCredential.id,[state.filterLiked,state.filterSeen]);
        }
        this.setState(state);
    }

    autocompleteChange(value) {
        if (this.autoCompleteThrottle) {
            clearTimeout(this.autoCompleteThrottle);
        }
        if ((!value || value === '') && this.state.options.search !== '') {
            MoviesListActions.search.defer('');
            return;
        }
        this.autoCompleteThrottle = setTimeout(()=> {
            MoviesListActions.getMoviesNames.defer(null,null,value);
        }, 300);
    }

    getMovie(movieName) {
        if (movieName !== this.state.options.search) {
            MoviesListActions.search.defer(movieName);
        }
    }

    handleLazyLoad(e) {
        if (e.srcElement.body.scrollTop >= e.srcElement.body.scrollHeight - window.innerHeight && !this.state.allResultsLoaded && !this.state.lazyLoading && this.state.options.search === '') {
            MoviesListActions.getMoviesList.defer(this.state.options,this.props.userCredential.id,[this.state.filterLiked,this.state.filterSeen]);
        }
    }

    render() {
        let settings = [
            {
                title: 'Sort By',
                value: this.state.options.field,
                onChange: MoviesListActions.sortFieldChange,
                options: [
                    {
                        label: 'Rating',
                        value: 'rating'
                    },
                    {
                        label: 'Title',
                        value: 'title'
                    },
                    {
                        label: 'Year',
                        value: 'year'
                    }
                ]
            },
            {
                title: 'Sort Direction',
                value: this.state.options.direction,
                onChange: MoviesListActions.sortDirectionChange,
                options: [
                    {
                        label: 'Ascending',
                        value: '1'
                    },
                    {
                        label: 'Descending',
                        value: '-1'
                    }
                ]
            }
        ];
        if (this.props.userCredential && this.props.userCredential.id) {
            settings.push({
                title: 'Show Liked or Disliked',
                value: this.state.filterLiked,
                onChange: MoviesListActions.filterLikedChange,
                options: [
                    {
                        label: 'All',
                        value: 'all'
                    },
                    {
                        label: 'Liked',
                        value: 'liked'
                    },
                    {
                        label: 'Disliked',
                        value: 'disliked'
                    }
                ]
            }, {
                title: 'Show Seen or Not Seen',
                value: this.state.filterSeen,
                onChange: MoviesListActions.filterSeenChange,
                options: [
                    {
                        label: 'All',
                        value: 'all'
                    },
                    {
                        label: 'Seen',
                        value: 'seen'
                    },
                    {
                        label: 'Not Seen',
                        value: 'unseen'
                    }
                ]
            });
        }
        return (
            <div>
                <div className="holder">
                    <Autocomplete
                        id="moviesListSearch"
                        label="Name of a movie"
                        data={this.state.moviesNames}
                        className="md-cell md-cell--8 movies-search"
                        filter={null}
                        onAutocomplete={this.getMovie}
                        type="search"
                        onChange={this.autocompleteChange}
                    />
                </div>
                {this.state.searchLoading &&
                <LinearProgress key="searchLoading" id="searchLoading" style={{margin: '0'}}/>}
                <MovieCard
                    data={this.state.moviesList}
                    userCredential={this.props.userCredential}
                    collection={this.props.collection} wishlist={this.props.wishlist} seen={this.props.seen}
                    liked={this.props.liked} disliked={this.props.disliked}/>
                <CircularProgress className={!this.state.lazyLoading ? 'hide' : ''} key="lazyLoading" id="lazyLoading"/>
                <Settings
                    toggle={MoviesListActions.toggleSettings}
                    disabled={this.state.options.search !== ''}
                    show={this.state.settings}
                    data={settings}/>
            </div>
        );
    }
}

export default MoviesList;