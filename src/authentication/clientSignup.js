import React, { Component } from 'react'
import AuthContext from '../context/Authentication-context'
import languagesContext from '../context/languages-context'

class ClientSignup extends Component {

    static contextType = languagesContext

    componentDidMount() {
        this.userNameInput.focus()
    }

    render() {
        const { t } = this.context
        return (
            <div className="row col-md-10" style={{ marginBottom: "20px" }}>
                <AuthContext.Consumer>
                    {
                        context =>
                            !this.props.showSignupResult ?
                                <div className="row col-md-12">
                                    <div className="col-md-12">
                                        <div className="form-group" style={{ marginTop: '20px' }}>
                                            <label htmlFor="signup-username" className="centered">
                                                <b>{t('username')}</b>
                                            </label>
                                            <input type="text" className="form-control"
                                                id="signup-username"
                                                placeholder={t('username-placeholder')}
                                                ref={_inputRef => this.userNameInput = _inputRef}
                                                onChange={context.upUsernameChanged}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-12">
                                        <div className="form-group" style={{ marginTop: '20px' }}>
                                            <label htmlFor="signup-email" className="centered">
                                                <b>{t('emailAddress')}</b>
                                            </label>
                                            <input type="text" className="form-control"
                                                id="signup-email"
                                                placeholder={t('emailAddress_placeholder')}
                                                onChange={(e) => context.upEmailChanged(e) & this.props.clientUpEmailChanged(e)}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-group" style={{ marginTop: '20px' }}>
                                            <label htmlFor="signup-password" className="centered">
                                                <b>{t('password')}</b>
                                            </label>
                                            <input type="password" className="form-control"
                                                id="-signup-password"
                                                placeholder={t('password_placeholder')}
                                                onChange={context.upPasswordChanged}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-group" style={{ marginTop: '20px' }}>
                                            <label htmlFor="signup-password-cnf" className="centered">
                                                <b>{t('password-conf')}</b>
                                            </label>
                                            <input type="password" className="form-control"
                                                id="signup-password-cnf"
                                                placeholder={t('password-conf-placeholder')}
                                                onChange={context.upPasswordConfChanged}
                                            />
                                        </div>
                                    </div>
                                    {this.props.loader ?
                                        <div className="col-md-12 centered">
                                            <div className="analyse-loader centered" />
                                        </div>
                                        : null
                                    }
                                </div>
                                :
                                <div className="row centered" style={{ marginTop: '20px' }}>
                                    <h3 className="col-md-12 centered" style={{ marginTop: '20px' }}>{t('welcomeMsg')}</h3>
                                    <h4 className="col-md-12 centered" style={{ marginTop: '20px' }}>{t('address')}</h4>
                                    <label className="col-md-12 centered" style={{ marginTop: '20px' }}>{this.props.address}</label>
                                    <h4 className="col-md-12 centered" style={{ marginTop: '20px' }}>{t('privateKey')}</h4>
                                    <label className="col-md-12 centered" style={{ marginTop: '20px' }}>{this.props.privateKey}</label>
                                    <div className="col-md-12 centered" style={{ marginTop: '20px' }}>
                                        <button
                                            className="btn btn-success centered"
                                            style={{ marginBottom: '20px' }}
                                            onClick={this.props.enter}
                                        >
                                            {t('enter')}
                                        </button>
                                    </div>
                                </div>
                    }
                </AuthContext.Consumer>
            </div>
        )
    }
}

export default ClientSignup;