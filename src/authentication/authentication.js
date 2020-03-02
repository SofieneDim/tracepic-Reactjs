import React, { Component } from 'react'
import Helmet from 'react-helmet'
import './Authentication.css'

import logo from '../assets/LogoFdBleu@1x.png'
import signinImage from '../assets/signin-image.jpg'
import Signin from './signIn'
import ClientSignup from './clientSignup'
import LaboSignup from './labosSignup'

import languagesContext from '../context/languages-context'

class Authentication extends Component {

    static contextType = languagesContext

    state = {
        decide: false,
        client: false,
    }

    render() {
        const { t } = this.context
        return (
            <div>
                <Helmet>
                    <style>{'body { background-color: rgb(49, 54, 203, 0.9); }'}</style>
                </Helmet>
                <div className="row">
                    <div className="col-md-12">
                        <div id="sign-in-header">
                            <img src={logo} alt="" />
                        </div>
                    </div>
                    <div className="col-md-12">
                        <div className="row" id="sign-inBody" style={{ backgroundColor: 'white' }}>
                            <div className="col-md-1"></div>
                            <div className="row col-md-3 centered">
                                <div className="col-md-12 centered" style={{ marginTop: '20px' }}>
                                    <h2 id='sign-in-up-title'>
                                        {this.props.signinSignup ? t('signin') : t('signup')}
                                    </h2>
                                </div>
                                <div className="col-md-12 centered">
                                    <img src={signinImage} alt="" />
                                </div>
                            </div>
                            <div className="col-md-8">
                                <form onSubmit={this.props.click}>
                                    <div>
                                        <div className="row">
                                            <div className="col-md-1"></div>
                                            {this.props.signinSignup ?
                                                <Signin />
                                                :
                                                !this.state.decided ?
                                                    <div className="row col-md-12">
                                                        <div className="col-md-12">
                                                            <h3 id="signup-suggestion">{t('signupAs')}</h3>
                                                        </div>
                                                        <div className="col-md-6 centered">
                                                            <h4>{t('Labo')}</h4>
                                                        </div>
                                                        <div className="col-md-6 centered">
                                                            <h4>{t('Client')}</h4>
                                                        </div>
                                                        <div className="col-md-6 centered">
                                                            <button
                                                                type="button"
                                                                onClick={() => this.setState({ decided: true, client: false })}
                                                                id="signup-labo"
                                                            ></button>
                                                        </div>
                                                        <div className="col-md-6 centered">
                                                            <button
                                                                type="button"
                                                                onClick={() => this.setState({ decided: true, client: true })}
                                                                id="signup-client"
                                                            ></button>
                                                        </div>
                                                    </div>
                                                    :
                                                    this.state.client ?
                                                        <ClientSignup
                                                            loader={this.props.loader}
                                                            showSignupResult={this.props.showSignupResult}
                                                            address={this.props.address}
                                                            privateKey={this.props.privateKey}
                                                            enter={this.props.enter}
                                                        />
                                                        :
                                                        <LaboSignup />
                                            }
                                            <div className="col-md-1"></div>
                                        </div>
                                    </div>
                                    <div className="row modal-footer">
                                        <div className='col-md-3'>
                                            <button className="btn btn-primary" type="button"
                                                style={{ backgroundColor: '#3384CC', float: 'left' }} onClick={this.props.signup}
                                            >{this.props.signinSignup ? t('goToSignup') : t('goToSignin')}</button>
                                        </div>
                                        <div className='col-md-8'>
                                            <button className="btn btn-primary signin_botton" type="submit"
                                                onClick={this.state.client ? (e) => this.props.submit(e, true) : (e) => this.props.submit(e, false) }
                                                style={{ backgroundColor: '#3333CC', float: 'right' }}
                                            >{t('connect')}</button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Authentication;