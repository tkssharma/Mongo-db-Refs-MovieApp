/**
 * Created by jafari on 12/23/2016 AD.
 */
import React from 'react';
import {Link} from 'react-router';
import alt from '../alt';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

import PersonPageStore from '../stores/PersonStore';
import PersonPageActions from '../actions/PersonActions';
import AppActions from '../actions/AppActions';

import Card from 'react-md/lib/Cards/Card';
import CardTitle from 'react-md/lib/Cards/CardTitle';
import CardText from 'react-md/lib/Cards/CardText';
import Media, {MediaOverlay} from 'react-md/lib/Media';
import LinearProgress from 'react-md/lib/Progress/LinearProgress';

class PersonPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = PersonPageStore.getState();
        this.onChange = this.onChange.bind(this);
        this.type = this.props.location.pathname.split('/')[1];
    }

    componentDidMount() {
        PersonPageStore.listen(this.onChange);
        PersonPageActions.getPerson.defer(this.props.params.id, this.props.userCredential && this.props.userCredential.id ? this.props.userCredential.id : null, this.type);
        AppActions.loading.defer(true, `Loading ${this.props.params.name}'s info...`);
    }

    componentWillUnmount() {
        PersonPageStore.unlisten(this.onChange);
        alt.recycle(PersonPageStore);
    }

    onChange(state) {
        this.setState(state);
    }

    render() {
        return (
            <ReactCSSTransitionGroup
                transitionName="animate"
                transitionEnterTimeout={200}
                transitionLeaveTimeout={200}>
                {
                    this.state.person._id ?
                        <Card style={{width: '90%', maxWidth: '636px', margin: '32px auto 0'}}
                              className="md-block-centered">
                            <Media>
                                {this.state.downloadingImage &&
                                <div className="loading-image">
                                    <LinearProgress key="loadingImage" id="loadingImage" style={{margin: '0'}}/>
                                    <p>{`Downloading ${this.props.params.name}'s image...`}</p>
                                </div>}
                                <img onError={() => {
                                    PersonPageActions.downloadingImage();
                                    PersonPageActions.getImage.defer(this.state.person._id, this.type)
                                }} src={this.state.person.image ? this.state.person.image.replace('public', '') : ''}
                                     role="presentation"/>
                                <MediaOverlay>
                                    <CardTitle title={this.state.person.name}>
                                        <h3 style={{margin: '0 0 0 auto'}}>
                                            {this.state.person.movies.length}
                                            &nbsp;movie{this.state.person.movies.length > 1 ? 's' : ''}</h3>
                                    </CardTitle>
                                </MediaOverlay>
                            </Media>
                            <CardText>
                                {
                                    this.props.userCredential && this.props.userCredential.id ?
                                        <div>
                                            <h4>Movies of {this.state.person.name} you own:</h4>
                                            {
                                                this.state.userMovies.length ?
                                                    this.state.userMovies.map(movie =>
                                                        <Link className="card-link"
                                                              key={movie._id + 'owned'}
                                                              to={`/movies/${movie._id}/${movie.title}`}
                                                              style={{margin: '0px'}}>
                                                            <Media key={movie._id + 'owned-movie'} style={{
                                                                width: '135px',
                                                                height: '200px',
                                                                display: 'inline-block',
                                                                margin: '8px',
                                                                paddingBottom: '0'
                                                            }}>
                                                                <img src={movie.poster.replace('public', '')}
                                                                     role="presentation"
                                                                     style={{
                                                                         position: 'static',
                                                                         transform: 'translateX(0)'
                                                                     }}/>
                                                                <MediaOverlay>
                                                                    <CardTitle className="small-text"
                                                                               title={movie.title}
                                                                               subtitle={movie.year}/>
                                                                </MediaOverlay>
                                                            </Media>
                                                        </Link>
                                                    )
                                                    : `You don't have any movie of ${this.state.person.name}.`
                                            }
                                            <hr/>
                                        </div>
                                        : null
                                }
                                <h4>Movies of {this.state.person.name}:</h4>
                                {
                                    this.state.person.movies ?
                                        this.state.person.movies.map(movie =>
                                            <Link className="card-link"
                                                  key={movie._id}
                                                  to={`/movies/${movie._id}/${movie.title}`}
                                                  style={{margin: '0px'}}>
                                                <Media key={movie._id + 'movie'} style={{
                                                    width: '135px',
                                                    height: '200px',
                                                    display: 'inline-block',
                                                    margin: '8px',
                                                    paddingBottom: '0'
                                                }}>
                                                    <img src={movie.poster.replace('public', '')} role="presentation"
                                                         style={{
                                                             position: 'static',
                                                             transform: 'translateX(0)'
                                                         }}/>
                                                    <MediaOverlay>
                                                        <CardTitle className="small-text" title={movie.title}
                                                                   subtitle={movie.year}/>
                                                    </MediaOverlay>
                                                </Media>
                                            </Link>
                                        )
                                        : null
                                }
                                <hr/>
                                <h3>About {this.state.person.name}:</h3>
                                <div className="text-justify"
                                     dangerouslySetInnerHTML={{__html: this.state.person.summary}}/>
                            </CardText>
                        </Card>
                        :
                        null
                }
            </ReactCSSTransitionGroup>
        );
    }
}

export default PersonPage;