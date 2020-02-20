import React, { Component } from 'react'
import RecoverPrivateKey from './recoverPrivateKey'

import AuthContext from '../context/Authentication-context'
import languagesContext from '../context/languages-context'

class signin extends Component {

    static contextType = languagesContext

    constructor(props) {
        super(props)
        this.state = {
            recoverPrivateKey: false
        }
    }

    componentDidMount() {
        this.privateKeyInput.focus()
    }

    render() {

        const { t } = this.context

        return (
            <div className="col-md-10" >
                {!this.state.recoverPrivateKey ?
                    <div id="sign-in-up-template" >
                        <AuthContext.Consumer>
                            {
                                context =>
                                    <div>
                                        <div className="form-group" style={{ marginTop: '20px' }
                                        }>
                                            <label htmlFor="signIn-account-address" className="centered" >
                                                <b>{t('privateKey')}</b >
                                            </label >
                                            <input type="text" className="form-control"
                                                id="signIn-account-address"
                                                placeholder={t('privateKey_placeholder')}
                                                ref={_inputRef => this.privateKeyInput = _inputRef}
                                                onChange={context.inPrivateKeyChanged}
                                                required
                                            />
                                            <small id="emailHelp" className="form-text text-muted">
                                                {t('privateKey_helper')}
                                            </small>
                                        </div >
                                        <div className="form-group" style={{ marginTop: '20px' }}>
                                            <label htmlFor="signIn-account-email" className="centered" >
                                                <b>{t('emailAddress')}</b >
                                            </label >
                                            <input type="email" className="form-control"
                                                id="signIn-account-email" describedby="emailHelp"
                                                placeholder={t('emailAddress_placeholder')}
                                                onChange={context.inEmailChanged}
                                                required
                                            />
                                            <small id="emailHelp" className="form-text text-muted">
                                                {t('emailAddress_helper')}
                                            </small>
                                        </div >
                                        <div className="form-group" style={{ marginTop: '20px' }}>
                                            <label htmlFor="signIn-account-password" className="centered" >
                                                <b>{t('password')}</b >
                                            </label >
                                            <input type="password" className="form-control"
                                                id="signIn-account-password"
                                                placeholder={t('password_placeholder')}
                                                onChange={context.inPasswordChanged}
                                                required
                                            />
                                        </div >
                                    </div >
                            }
                        </AuthContext.Consumer >
                        <a href="#" onClick={() => this.setState({ recoverPrivateKey: true })}> {t('privateKeyForgotten')}</a >
                    </div >
                    :
                    <RecoverPrivateKey
                        cancel={() => this.setState({ recoverPrivateKey: false })}
                    />
                }
            </div >
        )
    }
}

export default signin;