/**
 * Created by jafari on 12/23/2016 AD.
 */
import React from 'react';
import alt from '../alt';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

import MovieStore from '../stores/MovieStore';
import MovieActions from '../actions/MovieActions';
import AppActions from '../actions/AppActions';
import MovieCard from './MovieCard';

class Movie extends React.Component {

    constructor(props) {
        super(props);
        this.state = MovieStore.getState();
        this.onChange = this.onChange.bind(this);
    }

    componentDidMount() {
        MovieStore.listen(this.onChange);
        MovieActions.getMovie.defer(this.props.params.id);
        AppActions.loading.defer(true, `Loading ${this.props.params.name}...`);
        if (!this.state.movie.trailer) {
            this.getVideo(url=> {
                MovieActions.setVideo.defer(url);
            });
        }
    }

    componentWillUnmount() {
        MovieStore.unlisten(this.onChange);
        alt.recycle(MovieStore);
    }

    onChange(state) {
        this.setState(state);
    }

    getVideo(callback) {
        if (window.youtubeReady && this.state.movie.title && (!this.state.movie.trailer || this.state.movie.trailer.trim() === '')) {
            var q = this.state.movie.title + ' trailer';
            var request = gapi.client.youtube.search.list({
                q: q,
                part: 'snippet'
            });

            request.execute((response) => {
                let url = 'https://www.youtube.com/embed/' + response.result.items[0].id.videoId;
                MovieActions.saveTrailer.defer(this.state.movie._id, url);
                callback(url);
            });
        }
        else {
            setTimeout(()=> {
                if((!this.state.movie.trailer || this.state.movie.trailer.trim() === '')){
                    this.getVideo(callback);
                }
            }, 500);
        }
    }

    render() {
        console.log(this.state.movie.trailer);
        return (
            <ReactCSSTransitionGroup
                transitionName="animate"
                transitionEnterTimeout={200}
                transitionLeaveTimeout={200}>
                {
                    this.state.movie._id ?
                        <MovieCard data={[this.state.movie]} userCredential={this.props.userCredential}
                                   collection={this.props.collection} wishlist={this.props.wishlist}
                                   seen={this.props.seen}
                                   showTrailer
                                   liked={this.props.liked} disliked={this.props.disliked} expanded withImage/>
                        : null
                }
            </ReactCSSTransitionGroup>
        );
    }
}

export default Movie;