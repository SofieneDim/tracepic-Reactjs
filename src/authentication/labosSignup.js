import React, { Component } from 'react'
import languagesContext from '../context/languages-context'
import AuthContext from '../context/Authentication-context'

class LaboSignup extends Component {

    state = {
        loader: false,
    }

    static contextType = languagesContext

    componentDidMount() {
        //this.laboNameInput.focus()
    }

    render() {
        const { t } = this.context
        return (
            <div className="row col-md-10" style={{ marginBottom: "20px" }}>
                <div className="row col-md-12">
                    {!this.props.laboShowSignupResult ?
                        <AuthContext.Consumer>
                            {
                                context =>
                                    [
                                        <div className="col-md-5" key="1">
                                            <div className="form-group" style={{ marginTop: '20px' }}>
                                                <label htmlFor="signup-laboNme" className="centered">
                                                    <b>{t('laboName')}</b>
                                                </label>
                                                <input type="text" className="form-control"
                                                    id="signup-laboNme"
                                                    placeholder={t('laboName-placeholder')}
                                                    ref={_inputRef => this.laboNameInput = _inputRef}
                                                    onChange={(e) => context.laboUpNameChanged(e) & this.props.laboUpNameChanged(e)}
                                                />
                                            </div>
                                        </div>,
                                        <div className="col-md-7" key="2">
                                            <div className="form-group" style={{ marginTop: '20px' }}>
                                                <label htmlFor="signup-laboAddress" className="centered">
                                                    <b>{t('laboAddress')}</b>
                                                </label>
                                                <input type="text" className="form-control"
                                                    id="signup-laboAddress"
                                                    placeholder={t('laboAddress-placeholder')}
                                                    onChange={(e) => context.laboUpAddressChanged(e) & this.props.laboUpAddressChanged(e)}
                                                />
                                            </div>
                                        </div>,
                                        <div className="col-md-12" key="3">
                                            <div className="form-group" style={{ marginTop: '20px' }}>
                                                <label htmlFor="signup-email" className="centered">
                                                    <b>{t('emailAddress')}</b>
                                                </label>
                                                <input type="text" className="form-control"
                                                    id="signup-email"
                                                    placeholder={t('emailAddress_placeholder')}
                                                    onChange={(e) => context.laboUpEmailChanged(e) & this.props.laboUpEmailChanged(e)}
                                                />
                                            </div>
                                        </div>,
                                        <div className="col-md-6" key="4">
                                            <div className="form-group" style={{ marginTop: '20px' }}>
                                                <label htmlFor="signup-password" className="centered">
                                                    <b>{t('password')}</b>
                                                </label>
                                                <input type="password" className="form-control"
                                                    id="-signup-password"
                                                    placeholder={t('password_placeholder')}
                                                    onChange={(e) => context.laboUpPasswordChanged(e) & this.props.laboUpPasswordChanged(e)}
                                                />
                                            </div>
                                        </div>,
                                        <div className="col-md-6" key="5">
                                            <div className="form-group" style={{ marginTop: '20px' }}>
                                                <label htmlFor="signup-password-cnf" className="centered">
                                                    <b>{t('password-conf')}</b>
                                                </label>
                                                <input type="password" className="form-control"
                                                    id="signup-password-cnf"
                                                    placeholder={t('password-conf-placeholder')}
                                                    onChange={(e) => context.laboUpPasswordConfChanged(e) & this.props.laboUpPasswordConfChanged(e)}
                                                />
                                            </div>
                                        </div>,
                                        this.props.loading ?
                                            <div className="col-md-12 centered" key="6">
                                                <div className="analyse-loader centered" />
                                            </div>
                                            : null
                                    ]
                            }
                        </AuthContext.Consumer>
                        :
                        <div className="row centered" style={{ marginTop: '10px' }}>
                            <h3 className="col-md-12 centered" style={{ color: 'green', marginTop: '0px' }}>{t('laboSignupMsg1')}</h3>
                            <h4 className="col-md-12 centered" style={{ color: 'green' }}>{t('laboSignupMsg2')}</h4>
                            <h4 className="col-md-12 centered" style={{ marginTop: '20px' }}>{t('address')}</h4>
                            <label className="col-md-12 centered" style={{ marginTop: '20px' }}>{this.props.address}</label>
                            <h4 className="col-md-12 centered" style={{ marginTop: '20px' }}>{t('privateKey')}</h4>
                            <label className="col-md-12 centered" style={{ marginTop: '20px' }}>{this.props.pivateKey}</label>
                        </div>
                    }
                </div>
            </div>
        )
    }
}

export default LaboSignup;