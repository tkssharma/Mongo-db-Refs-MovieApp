/**
 * Created by jafari on 12/23/2016 AD.
 */
import React from 'react';
import {Router, browserHistory} from 'react-router';
import ReactDOM from 'react-dom';
import routes from './routes';

ReactDOM.render(<Router history={browserHistory} routes={routes}/>, document.getElementById('app'));