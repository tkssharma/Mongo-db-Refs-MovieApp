/**
 * Created by jafari on 12/23/2016 AD.
 */
import React from 'react';
import {Link} from 'react-router';
import alt from '../alt';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

import GenresListStore from '../stores/GenresListStore';
import GenresListActions from '../actions/GenresListActions';
import Settings from './Settings';

import Card from 'react-md/lib/Cards/Card';
import CardTitle from 'react-md/lib/Cards/CardTitle';
import Media, {MediaOverlay} from 'react-md/lib/Media';

class GenresList extends React.Component {

    constructor(props) {
        super(props);
        this.state = GenresListStore.getState();
        this.onChange = this.onChange.bind(this);
    }

    componentDidMount() {
        GenresListStore.listen(this.onChange);
        GenresListActions.getGenresList.defer(this.props.userCredential && this.props.userCredential.id ? this.props.userCredential.id : null, this.state.category);
    }

    componentWillUnmount() {
        GenresListStore.unlisten(this.onChange);
        alt.recycle(GenresListStore);
    }

    onChange(state) {
        var newSearch = state.category;
        if (state.currentCategory !== newSearch) {
            state.currentCategory = newSearch;
            GenresListActions.getGenresList.defer(this.props.userCredential && this.props.userCredential.id ? this.props.userCredential.id : null, state.category);
        }
        this.setState(state);
    }

    render() {
        let settings = [
            {
                title: 'Show',
                value: this.state.category,
                onChange: GenresListActions.categoryChange,
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
            }
        ];
        return (
            <div>
                <ReactCSSTransitionGroup
                    transitionName="scale"
                    transitionEnterTimeout={200}
                    transitionLeaveTimeout={200}>
                    {
                        this.state.genresList.sort((a, b) => a.name.localeCompare(b.name)).map(prop =>
                            <Card key={prop.name} style={{width: '90%', maxWidth: '600px', margin: '32px auto 0'}}
                                  className="md-block-centered">
                                <Media>
                                    <div style={{
                                        width: '100%',
                                        height: '100%',
                                        position: 'absolute'
                                    }}>
                                        {
                                            prop.movies.map(movie => <img key={movie} className="genre-image"
                                                                          src={movie.replace('public/', '')}
                                                                          role="presentation"/>)
                                        }
                                    </div>
                                    <MediaOverlay>
                                        <Link className="card-link"
                                              key={prop.name + 'link'}
                                              to={`/genres/${prop.name}/${this.state.category}`}
                                              style={{margin: '0px'}}>
                                            <CardTitle title={prop.name}>
                                                <h3 style={{margin: '0 0 0 auto'}}>{prop.count}</h3>
                                            </CardTitle>
                                        </Link>
                                    </MediaOverlay>
                                </Media>
                            </Card>
                        )
                    }
                </ReactCSSTransitionGroup>
                <Settings
                    toggle={GenresListActions.toggleSettings}
                    disabled={!(this.props.userCredential && this.props.userCredential.id)}
                    show={this.state.settings}
                    data={settings}/>
            </div>
        );
    }
}

export default GenresList;