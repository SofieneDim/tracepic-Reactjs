import React, { Component } from 'react'
import App from './App';

import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom'
import Contract from './authentication/emailConfirmation.js/initContract';

class Container extends Component {
    render = () =>
        <BrowserRouter>
            <Switch>
                <Route exact path='/confirm/:id' component={Contract} />
                <Route exact path='/' component={App} />
                <Redirect from='*' to='/' />
            </Switch>
        </BrowserRouter>
}
export default Container;