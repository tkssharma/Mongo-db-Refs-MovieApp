/**
 * Created by jafari on 12/23/2016 AD.
 */
import React from 'react';
import {Link} from 'react-router';
import alt from '../alt';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

import PersonsListStore from '../stores/PersonsListStore';
import PersonsListActions from '../actions/PersonsListActions';

import CardTitle from 'react-md/lib/Cards/CardTitle';
import Media, {MediaOverlay} from 'react-md/lib/Media';
import CircularProgress from 'react-md/lib/Progress/CircularProgress';
import Autocomplete from 'react-md/lib/Autocompletes';
import LinearProgress from 'react-md/lib/Progress/LinearProgress';

class PersonsList extends React.Component {

    constructor(props) {
        super(props);
        this.state = PersonsListStore.getState();
        this.type = this.props.location.pathname.split('/')[1].replace('-list', '');
        this.onChange = this.onChange.bind(this);
        this.autocompleteChange = this.autocompleteChange.bind(this);
        this.getMovie = this.getMovie.bind(this);
        this.handleLazyLoad = this.handleLazyLoad.bind(this);
        this.allSet = false;
    }

    componentDidMount() {
        PersonsListStore.listen(this.onChange);
        PersonsListActions.getPersonsList.defer(this.props.userCredential ? this.props.userCredential.id : null, this.state.options, this.type);
        this.allSet = true;
        window.addEventListener('scroll', this.handleLazyLoad);
    }

    componentWillUnmount() {
        PersonsListStore.unlisten(this.onChange);
        alt.recycle(PersonsListStore);
        window.removeEventListener('scroll', this.handleLazyLoad);
    }

    componentWillReceiveProps(nextProps) {
        if (this.type !== nextProps.location.pathname.split('/')[1].replace('-list', '')) {
            this.allSet = false;
            this.type = nextProps.location.pathname.split('/')[1].replace('-list', '');
            alt.recycle(PersonsListStore);
        }
    }

    onChange(state) {
        var newSearch = state.options.search;
        if (state.searchValue !== newSearch) {
            state.searchValue = newSearch;
            PersonsListActions.getPersonsList.defer(this.props.userCredential ? this.props.userCredential.id : null, state.options, this.type);
        }
        if (!this.allSet) {
            this.allSet = true;
            PersonsListActions.getPersonsList.defer(this.props.userCredential ? this.props.userCredential.id : null, state.options, this.type);
        }
        this.setState(state);
    }

    autocompleteChange(value) {
        if (this.autoCompleteThrottle) {
            clearTimeout(this.autoCompleteThrottle);
        }
        if ((!value || value === '') && this.state.options.search !== '') {
            PersonsListActions.search.defer('');
            return;
        }
        this.autoCompleteThrottle = setTimeout(() => {
            PersonsListActions.getPersonsNames.defer(this.type, value);
        }, 300);
    }

    getMovie(movieName) {
        if (movieName !== this.state.options.search) {
            PersonsListActions.search.defer(movieName);
        }
    }

    handleLazyLoad(e) {
        if (e.srcElement.body.scrollTop >= e.srcElement.body.scrollHeight - window.innerHeight && !this.state.allResultsLoaded && !this.state.lazyLoading && this.state.options.search === '') {
            PersonsListActions.getPersonsList.defer(this.props.userCredential ? this.props.userCredential.id : null, this.state.options, this.type);
        }
    }

    render() {
        return (
            <div>
                <div className="holder">
                    <Autocomplete
                        id="personsListSearch"
                        label={`Name of a ${this.type.replace('s', '')}`}
                        data={this.state.personsNames}
                        className="md-cell md-cell--8 movies-search"
                        filter={null}
                        onAutocomplete={this.getMovie}
                        type="search"
                        onChange={this.autocompleteChange}
                    />
                </div>
                {this.state.searchLoading &&
                <LinearProgress key="searchLoading" id="searchLoading" style={{margin: '0'}}/>}
                <div className="text-center" style={{maxWidth: '980px', margin: '32px auto 0'}}>
                    <ReactCSSTransitionGroup
                        transitionName="scale"
                        transitionEnterTimeout={200}
                        transitionLeaveTimeout={200}>
                        {
                            this.state.personsList.map(prop =>
                                <Link className="card-link"
                                      key={prop._id}
                                      to={`/${this.type}/${prop._id}/${prop.name}`}
                                      style={{margin: '0px'}}>
                                    <Media key={prop._id + 'media'} className="image-list-item">
                                        <img onError={(event) => {
                                            event.target.src = '/img/defaultImage.gif';
                                        }} src={prop.image ? prop.image.replace('public', '') : '/img/defaultImage.gif'}
                                             role="presentation"/>
                                        <MediaOverlay>
                                            <CardTitle className="small-text" title={prop.name}>
                                                <h3 style={{margin: '0 0 0 auto'}}>{ (prop.count ? prop.count + ' / ' : '') + prop.movies.length}</h3>
                                            </CardTitle>
                                        </MediaOverlay>
                                    </Media>
                                </Link>
                            )
                        }
                    </ReactCSSTransitionGroup>
                    <div className="dummy-card-link"></div>
                    <div className="dummy-card-link"></div>
                    <div className="dummy-card-link"></div>
                </div>
                <CircularProgress className={!this.state.lazyLoading ? 'hide' : ''} key="lazyLoading" id="lazyLoading"/>
            </div>
        );
    }
}

export default PersonsList;