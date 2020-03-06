import React, { Component } from 'react'
import App from './App';
import Confirm from './authentication/confirmEmail';

import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom'

class Container extends Component {
    render = () =>
        <BrowserRouter>
            <Switch>
                <Route exact path='/confirm/:id' component={Confirm} />
                <Route exact path='/' component={App} />
                <Redirect from='*' to='/' />
            </Switch>
        </BrowserRouter>
}
export default Container;