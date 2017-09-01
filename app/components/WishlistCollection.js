/**
 * Created by jafari on 12/23/2016 AD.
 */
import React from 'react';
import alt from '../alt';

import WishlistCollectionStore from '../stores/WishlistCollectionStore';
import WishlistCollectionActions from '../actions/WishlistCollectionActions';
import MovieCard from './MovieCard';
import Settings from './Settings';

import Autocomplete from 'react-md/lib/Autocompletes';
import LinearProgress from 'react-md/lib/Progress/LinearProgress';
import CircularProgress from 'react-md/lib/Progress/CircularProgress';

class WishlistCollection extends React.Component {

    constructor(props) {
        super(props);
        this.state = WishlistCollectionStore.getState();
        this.type = this.props.location.pathname.split('/')[1];
        this.onChange = this.onChange.bind(this);
        this.autocompleteChange = this.autocompleteChange.bind(this);
        this.getMovie = this.getMovie.bind(this);
        this.handleLazyLoad = this.handleLazyLoad.bind(this);
        this.allSet = false;
    }

    componentDidMount() {
        WishlistCollectionStore.listen(this.onChange);
        if (this.props.userCredential && this.props.userCredential.id) {
            WishlistCollectionActions.getWishlistCollection.defer(this.props.userCredential.id, this.state.options, [this.type]);
            WishlistCollectionActions.getMoviesNames.defer(this.props.userCredential.id,[this.type]);
            this.allSet = true;
            window.addEventListener('scroll', this.handleLazyLoad);
        }
    }

    componentWillUnmount() {
        WishlistCollectionStore.unlisten(this.onChange);
        alt.recycle(WishlistCollectionStore);
        window.removeEventListener('scroll', this.handleLazyLoad);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps[this.type].length !== this.state.data.length) {
            let data = this.state.data.map(item=>item._id);
            let newData = nextProps[this.type].map(item=>item._id);
            let index = -1;
            for (let i = 0; i < data.length; i++) {
                if (newData.indexOf(data[i]) < 0) {
                    index = i;
                }
            }
            this.state.data.splice(index, 1);
            this.setState({data: this.state.data});
        }
        if (this.type !== nextProps.location.pathname.split('/')[1]) {
            this.allSet = false;
            this.type = nextProps.location.pathname.split('/')[1];
            alt.recycle(WishlistCollectionStore);
        }
    }

    onChange(state) {
        var newSearch = state.options.search;
        var newField = state.options.field;
        var newDirection = state.options.direction;
        if (state.currentOptions.search !== newSearch) {
            state.currentOptions.search = newSearch;
            WishlistCollectionActions.getWishlistCollection.defer(this.props.userCredential.id, state.options, [this.type,state.filterLiked,state.filterSeen]);
        }
        if (state.currentOptions.field !== newField) {
            state.currentOptions.field = newField;
            WishlistCollectionActions.getWishlistCollection.defer(this.props.userCredential.id, state.options, [this.type,state.filterLiked,state.filterSeen]);
        }
        if (state.currentOptions.direction !== newDirection) {
            state.currentOptions.direction = newDirection;
            WishlistCollectionActions.getWishlistCollection.defer(this.props.userCredential.id, state.options, [this.type,state.filterLiked,state.filterSeen]);
        }
        if (!this.allSet) {
            this.allSet = true;
            WishlistCollectionActions.getWishlistCollection.defer(this.props.userCredential.id, state.options, [this.type,state.filterLiked,state.filterSeen]);
            WishlistCollectionActions.getMoviesNames.defer(this.props.userCredential.id,[this.type,state.filterLiked,state.filterSeen]);
        }
        if (this.state.filterLiked!== state.filterLiked) {
            WishlistCollectionActions.getWishlistCollection.defer(this.props.userCredential.id, state.options, [this.type,state.filterLiked,state.filterSeen]);
            WishlistCollectionActions.getMoviesNames.defer(this.props.userCredential.id,[this.type,state.filterLiked,state.filterSeen]);
        }
        if (this.state.filterSeen!== state.filterSeen) {
            WishlistCollectionActions.getWishlistCollection.defer(this.props.userCredential.id, state.options, [this.type,state.filterLiked,state.filterSeen]);
            WishlistCollectionActions.getMoviesNames.defer(this.props.userCredential.id,[this.type,state.filterLiked,state.filterSeen]);
        }
        this.setState(state);
    }

    autocompleteChange(value) {
        if (value === '' && this.state.options.search !== '') {
            WishlistCollectionActions.search.defer('');
        }
    }

    getMovie(movieName) {
        if (movieName !== this.state.options.search) {
            WishlistCollectionActions.search.defer(movieName);
        }
    }

    handleLazyLoad(e) {
        if (e.srcElement.body.scrollTop >= e.srcElement.body.scrollHeight - window.innerHeight && !this.state.allResultsLoaded && !this.state.lazyLoading && this.state.options.search === '') {
            WishlistCollectionActions.getWishlistCollection.defer(this.props.userCredential.id, this.state.options, [this.type,this.state.filterLiked,this.state.filterSeen]);
        }
    }

    render() {
        let settings = [
            {
                title: 'Sort By',
                value: this.state.options.field,
                onChange: WishlistCollectionActions.sortFieldChange,
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
            },{
                title: 'Sort Direction',
                value: this.state.options.direction,
                onChange: WishlistCollectionActions.sortDirectionChange,
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
            },{
                title: 'Show Liked or Disliked',
                value: this.state.filterLiked,
                onChange: WishlistCollectionActions.filterLikedChange,
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
                onChange: WishlistCollectionActions.filterSeenChange,
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
            }
        ];
        return (
            <div>
                <div className="holder">
                    <Autocomplete
                        id="dataSearch"
                        label={`Name of a movie in your ${this.type}`}
                        data={this.state.moviesNames}
                        className="md-cell md-cell--8 movies-search"
                        filter={Autocomplete.fuzzyFilter}
                        onAutocomplete={this.getMovie}
                        type="search"
                        onChange={this.autocompleteChange}
                    />
                </div>
                {this.state.searchLoading &&
                <LinearProgress key="searchLoading" id="searchLoading" style={{margin: '0'}}/>}
                <MovieCard data={this.state.data}
                           userCredential={this.props.userCredential}
                           collection={this.props.collection} wishlist={this.props.wishlist} seen={this.props.seen}
                           liked={this.props.liked} disliked={this.props.disliked}/>
                <CircularProgress className={!this.state.lazyLoading ? 'hide' : ''} key="lazyLoading" id="lazyLoading"/>
                <Settings
                    toggle={WishlistCollectionActions.toggleSettings}
                    disabled={this.state.options.search !== ''}
                    show={this.state.settings}
                    data={settings}/>
            </div>
        );
    }
}

export default WishlistCollection;