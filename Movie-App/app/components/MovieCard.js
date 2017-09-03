/**
 * Created by jafari on 12/23/2016 AD.
 */
import React from 'react';
import {Link} from 'react-router';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

import AppActions from '../actions/AppActions';

import Card from 'react-md/lib/Cards/Card';
import CardTitle from 'react-md/lib/Cards/CardTitle';
import CardActions from 'react-md/lib/Cards/CardActions';
import CardText from 'react-md/lib/Cards/CardText';
import Media, {MediaOverlay} from 'react-md/lib/Media';
import Button from 'react-md/lib/Buttons';

class MovieCard extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <ReactCSSTransitionGroup
                    transitionName="scale"
                    transitionEnterTimeout={200}
                    transitionLeaveTimeout={200}>
                    {
                        this.props.data.map(prop =>
                            <Card key={prop._id} style={{width: '90%', maxWidth: '600px', margin: '32px auto 0'}}
                                  className="md-block-centered">
                                <Media>
                                    {
                                        prop.trailer && this.props.showTrailer ?
                                            <iframe allowFullScreen src={prop.trailer}/>
                                            :
                                            <img src={prop.poster.replace('public', '')} role="presentation"
                                                 onError={(event) => {
                                                     event.target.src = '/img/no_movie_image.png';
                                                 }}/>
                                    }
                                    <MediaOverlay>
                                        <Link className="card-link"
                                              key={prop._id + 'link'}
                                              to={`/movies/${prop._id}/${prop.title}`}
                                              style={{margin: '0px'}}>
                                            <CardTitle title={prop.title}
                                                       subtitle={prop.year + ' - ' + prop.genre.join(', ')}>
                                                <h3 style={{margin: '0 0 0 auto'}}>{prop.rating}</h3>
                                            </CardTitle>
                                        </Link>
                                    </MediaOverlay>
                                </Media>
                                {
                                    this.props.userCredential && this.props.userCredential.id ?
                                        <CardActions>
                                            <Button icon
                                                    primary={this.props.seen.map(item => item.title).indexOf(prop.title) > -1}
                                                    secondary={this.props.seen.map(item => item.title).indexOf(prop.title) === -1}
                                                    tooltipLabel="Seen" className="mini-icon"
                                                    onClick={() => {
                                                        if (this.props.seen.map(item => item.title).indexOf(prop.title) === -1) {
                                                            AppActions.seen(this.props.userCredential.id, prop._id);
                                                        }
                                                    }}>visibility</Button>
                                            <Button icon
                                                    primary={this.props.seen.map(item => item.title).indexOf(prop.title) === -1}
                                                    secondary={this.props.seen.map(item => item.title).indexOf(prop.title) > -1}
                                                    tooltipLabel="Not Seen"
                                                    className="mini-icon"
                                                    onClick={() => {
                                                        if (this.props.seen.map(item => item.title).indexOf(prop.title) > -1) {
                                                            AppActions.unseen(this.props.userCredential.id, prop._id);
                                                        }
                                                    }}>visibility_off</Button>
                                            <Button icon
                                                    secondary={this.props.liked.map(item => item.title).indexOf(prop.title) === -1}
                                                    primary={this.props.liked.map(item => item.title).indexOf(prop.title) > -1}
                                                    tooltipLabel="Liked" className="mini-icon"
                                                    onClick={() => {
                                                        if (this.props.liked.map(item => item.title).indexOf(prop.title) === -1) {
                                                            AppActions.like(this.props.userCredential.id, prop._id);
                                                        }
                                                        else {
                                                            AppActions.removeLike(this.props.userCredential.id, prop._id);
                                                        }
                                                    }}>thumb_up</Button>
                                            <Button icon
                                                    secondary={this.props.disliked.map(item => item.title).indexOf(prop.title) === -1}
                                                    primary={this.props.disliked.map(item => item.title).indexOf(prop.title) > -1}
                                                    tooltipLabel="Didn't like"
                                                    className="mini-icon"
                                                    onClick={() => {
                                                        if (this.props.disliked.map(item => item.title).indexOf(prop.title) === -1) {
                                                            AppActions.dislike(this.props.userCredential.id, prop._id);
                                                        }
                                                        else {
                                                            AppActions.removeDislike(this.props.userCredential.id, prop._id);
                                                        }
                                                    }}>thumb_down</Button>
                                        </CardActions>
                                        : null
                                }
                                <CardActions expander={!this.props.expanded}>
                                    {
                                        this.props.userCredential && this.props.userCredential.id ?
                                            <div>
                                                {
                                                    this.props.collection.filter(item => item._id === prop._id)[0] ?
                                                        <Button secondary flat label="disperse" onClick={() => {
                                                            AppActions.disperse(this.props.userCredential.id, prop._id)
                                                        }}/>
                                                        :
                                                        <Button secondary flat label="collect" onClick={() => {
                                                            AppActions.collect(this.props.userCredential.id, prop._id)
                                                        }}/>
                                                }
                                                {
                                                    !this.props.collection.filter(item => item._id === prop._id)[0] ?
                                                        this.props.wishlist.filter(item => item._id === prop._id)[0] ?
                                                            <Button secondary flat label="unwishlist" onClick={() => {
                                                                AppActions.unwishlist(this.props.userCredential.id, prop._id)
                                                            }}/>
                                                            :
                                                            <Button secondary flat label="wishlist" onClick={() => {
                                                                AppActions.wishlist(this.props.userCredential.id, prop._id)
                                                            }}/>
                                                        :
                                                        null
                                                }
                                            </div>
                                            : null
                                    }
                                </CardActions>
                                <CardTitle expandable={!this.props.expanded}
                                           title={`Type: ${prop.type.capitalize()} - Runtime: ${prop.runtime}`}
                                           subtitle={`Country: ${prop.country.join(', ')} - Language: ${prop.language.join(', ')}`}
                                />
                                <CardText expandable={!this.props.expanded}>
                                    <p>{prop.plot}</p>
                                    <p>{`Awards: ${prop.awards}`}</p>
                                    <div style={{margin: '8px 0'}}>
                                        Director{prop.directors.length > 1 ? 's' : ''}:
                                        <div>
                                            {prop.directors.map(item => <Link className="card-link"
                                                                              key={item._id}
                                                                              to={`/directors/${item._id}/${item.name}`}>
                                                {
                                                    this.props.withImage ?
                                                        <div className="small-image">
                                                            <p>{item.name}</p>
                                                            <div className="image-holder">
                                                                <img
                                                                    src={item.image ? item.image.replace('public', '') : '/img/defaultImage.gif'}
                                                                    onError={(event) => {
                                                                        event.target.src = '/img/defaultImage.gif';
                                                                    }}/>
                                                            </div>
                                                        </div>
                                                        : item.name
                                                }
                                            </Link>)}
                                        </div>
                                    </div>
                                    <div style={{margin: '8px 0'}}>
                                        Writer{prop.writers.length > 1 ? 's' : ''}:
                                        <div>
                                            {prop.writers.map(item => <Link className="card-link"
                                                                            key={item._id}
                                                                            to={`/writers/${item._id}/${item.name}`}>
                                                {
                                                    this.props.withImage ?
                                                        <div className="small-image">
                                                            <p>{item.name}</p>
                                                            <div className="image-holder">
                                                                <img
                                                                    src={item.image ? item.image.replace('public', '') : '/img/defaultImage.gif'}
                                                                    onError={(event) => {
                                                                        event.target.src = '/img/defaultImage.gif';
                                                                    }}/>
                                                            </div>
                                                        </div>
                                                        : item.name
                                                }
                                            </Link>)}
                                        </div>
                                    </div>
                                    <div style={{margin: '8px 0'}}>
                                        Actors:
                                        <div>
                                            {prop.actors.map(item => <Link className="card-link"
                                                                           key={item._id}
                                                                           to={`/actors/${item._id}/${item.name}`}>
                                                {
                                                    this.props.withImage ?
                                                        <div className="small-image">
                                                            <p>{item.name}</p>
                                                            <div className="image-holder">
                                                                <img
                                                                    src={item.image ? item.image.replace('public', '') : '/img/defaultImage.gif'}
                                                                    onError={(event) => {
                                                                        event.target.src = '/img/defaultImage.gif';
                                                                    }}/>
                                                            </div>
                                                        </div>
                                                        : item.name
                                                }
                                            </Link>)}
                                        </div>
                                    </div>
                                </CardText>
                            </Card>
                        )
                    }
                </ReactCSSTransitionGroup>
            </div>
        );
    }
}

export default MovieCard;