import React, { Component } from 'react'
import languagesContext from '../context/languages-context'

class LaboSignup extends Component {

    state = {
        laboName: '',
        laboPhAddress: '',
        laboEmail: '',
        laboPassword: '',
        laboPassword: '',
        loader: false,
    }

    static contextType = languagesContext

    componentDidMount() {
        this.laboNameInput.focus()
    }

    render() {
        const { t } = this.context
        return (
            <div className="row col-md-10" style={{ marginBottom: "20px" }}>
                <div className="row col-md-12">
                    <div className="col-md-5">
                        <div className="form-group" style={{ marginTop: '20px' }}>
                            <label htmlFor="signup-laboNme" className="centered">
                                <b>{t('laboName')}</b>
                            </label>
                            <input type="text" className="form-control"
                                id="signup-laboNme"
                                placeholder={t('laboName-placeholder')}
                                ref={_inputRef => this.laboNameInput = _inputRef}
                                onChange={(e) => this.setState({ laboName: e.target.value })}
                            />
                        </div>
                    </div>
                    <div className="col-md-7">
                        <div className="form-group" style={{ marginTop: '20px' }}>
                            <label htmlFor="signup-laboAddress" className="centered">
                                <b>{t('laboAddress')}</b>
                            </label>
                            <input type="text" className="form-control"
                                id="signup-laboAddress"
                                placeholder={t('laboAddress-placeholder')}
                                ref={_inputRef => this.laboNameInput = _inputRef}
                                onChange={(e) => this.setState({ laboPhAddress: e.target.value })}
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
                                onChange={(e) => this.setState({ laboEmail: e.target.value })}
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
                                onChange={(e) => this.setState({ laboPassword: e.target.value })}
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
                                onChange={(e) => this.setState({ laboPasswordConf: e.target.value })}
                            />
                        </div>
                    </div>
                    {this.state.loader ?
                        <div className="col-md-12 centered">
                            <div className="analyse-loader centered" />
                        </div>
                        : null
                    }
                </div>
            </div>
        )
    }
}

export default LaboSignup;