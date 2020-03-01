import React, { Component } from 'react'
import Helmet from 'react-helmet'
import './SignInUp.css'

import logo from '../imgs/LogoFdBleu@1x.png'
import signinImage from '../imgs/signin-image.jpg'
import Signin from './signIn'
import Signup from './signup'

import languagesContext from '../context/languages-context'

class Authentication extends Component {

    static contextType = languagesContext

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
                                                !this.props.showSignupResult ?
                                                    <Signup
                                                        loader={this.props.loader}
                                                    />
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
                                                onClick={this.props.submit}
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