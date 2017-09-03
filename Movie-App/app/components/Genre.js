/**
 * Created by jafari on 12/23/2016 AD.
 */
import React from 'react';
import alt from '../alt';

import GenreStore from '../stores/GenreStore';
import GenreActions from '../actions/GenreActions';
import MovieCard from './MovieCard';
import Settings from './Settings';

import CircularProgress from 'react-md/lib/Progress/CircularProgress';
import Autocomplete from 'react-md/lib/Autocompletes';
import LinearProgress from 'react-md/lib/Progress/LinearProgress';

class Genre extends React.Component {

    constructor(props) {
        super(props);
        this.state = GenreStore.getState();
        this.onChange = this.onChange.bind(this);
        this.autocompleteChange = this.autocompleteChange.bind(this);
        this.getMovie = this.getMovie.bind(this);
        this.handleLazyLoad = this.handleLazyLoad.bind(this);
    }

    componentDidMount() {
        GenreStore.listen(this.onChange);
        GenreActions.setCategory.defer(this.props.params.category);
        GenreActions.getGenre.defer(this.state.options, this.props.params.name, this.props.userCredential && this.props.userCredential.id ? this.props.userCredential.id : null, [this.props.params.category]);
        window.addEventListener('scroll', this.handleLazyLoad);
    }

    componentWillUnmount() {
        GenreStore.unlisten(this.onChange);
        alt.recycle(GenreStore);
        window.removeEventListener('scroll', this.handleLazyLoad);
    }

    onChange(state) {
        var newSearch = state.options.search;
        var newField = state.options.field;
        var newDirection = state.options.direction;
        var newCategory = state.category;
        if (state.currentOptions.search !== newSearch) {
            state.currentOptions.search = newSearch;
            GenreActions.getGenre.defer(state.options, this.props.params.name,this.props.userCredential && this.props.userCredential.id ? this.props.userCredential.id : null,[state.filterLiked,state.filterSeen, state.category]);
        }
        if (state.currentOptions.field !== newField) {
            state.currentOptions.field = newField;
            GenreActions.getGenre.defer(state.options, this.props.params.name,this.props.userCredential && this.props.userCredential.id ? this.props.userCredential.id : null,[state.filterLiked,state.filterSeen, state.category]);
        }
        if (state.currentOptions.direction !== newDirection) {
            state.currentOptions.direction = newDirection;
            GenreActions.getGenre.defer(state.options, this.props.params.name,this.props.userCredential && this.props.userCredential.id ? this.props.userCredential.id : null,[state.filterLiked,state.filterSeen, state.category]);
        }
        if (state.currentCategory && state.currentCategory !== newCategory) {
            state.currentCategory = newCategory;
            GenreActions.getGenre.defer(state.options, this.props.params.name,this.props.userCredential && this.props.userCredential.id ? this.props.userCredential.id : null,[state.filterLiked,state.filterSeen, state.category]);
            GenreActions.getMoviesNames.defer(this.props.params.name, this.props.userCredential && this.props.userCredential.id ? this.props.userCredential.id : null,[state.filterLiked,state.filterSeen,state.category]);
        }
        if (this.state.filterLiked!== state.filterLiked) {
            GenreActions.getGenre.defer(state.options, this.props.params.name,this.props.userCredential && this.props.userCredential.id ? this.props.userCredential.id : null,[state.filterLiked,state.filterSeen, state.category]);
            GenreActions.getMoviesNames.defer(this.props.params.name, this.props.userCredential && this.props.userCredential.id ? this.props.userCredential.id : null,[state.filterLiked,state.filterSeen,state.category]);
        }
        if (this.state.filterSeen!== state.filterSeen) {
            GenreActions.getGenre.defer(state.options, this.props.params.name,this.props.userCredential && this.props.userCredential.id ? this.props.userCredential.id : null,[state.filterLiked,state.filterSeen, state.category]);
            GenreActions.getMoviesNames.defer(this.props.params.name, this.props.userCredential && this.props.userCredential.id ? this.props.userCredential.id : null,[state.filterLiked,state.filterSeen,state.category]);
        }
        this.setState(state);
    }

    autocompleteChange(value) {
        if (this.autoCompleteThrottle) {
            clearTimeout(this.autoCompleteThrottle);
        }
        if ((!value || value === '') && this.state.options.search !== '') {
            GenreActions.search.defer('');
            return;
        }
        this.autoCompleteThrottle = setTimeout(()=> {
            GenreActions.getMoviesNames.defer(this.props.params.name, this.props.userCredential && this.props.userCredential.id ? this.props.userCredential.id : null, [this.props.params.category],value);
        }, 300);
    }

    getMovie(movieName) {
        if (movieName !== this.state.options.search) {
            GenreActions.search.defer(movieName);
        }
    }

    handleLazyLoad(e) {
        if (e.srcElement.body.scrollTop >= e.srcElement.body.scrollHeight - window.innerHeight && !this.state.allResultsLoaded && !this.state.lazyLoading && this.state.options.search === '' && this.state.category) {
            GenreActions.getGenre.defer(this.state.options, this.props.params.name,this.props.userCredential && this.props.userCredential.id ? this.props.userCredential.id : null,[this.state.filterLiked,this.state.filterSeen, this.state.category]);
        }
    }

    render() {
        let settings = [
            {
                title: 'Sort By',
                value: this.state.options.field,
                onChange: GenreActions.sortFieldChange,
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
                onChange: GenreActions.sortDirectionChange,
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
                title: 'Show',
                value: this.state.category,
                onChange: GenreActions.categoryChange,
                options: [
                    {
                        label: 'All',
                        value: 'all'
                    },
                    {
                        label: 'Collection',
                        value: 'movies'
                    },
                    {
                        label: 'Wishlist',
                        value: 'wishlist'
                    }
                ]
            }, {
                title: 'Show Liked or Disliked',
                value: this.state.filterLiked,
                onChange: GenreActions.filterLikedChange,
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
                onChange: GenreActions.filterSeenChange,
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
                        label="Name of a movie in this genre"
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
                    toggle={GenreActions.toggleSettings}
                    disabled={this.state.options.search !== ''}
                    show={this.state.settings}
                    data={settings}/>
            </div>
        );
    }
}

export default Genre;