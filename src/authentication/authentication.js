import React, { Component } from 'react'
import Helmet from 'react-helmet'
import './Authentication.css'

import logo from '../assets/LogoFdBleu@1x.png'
import signinImage from '../assets/signin-image.jpg'
import Signin from './signIn'
import ClientSignup from './clientSignup'
import LaboSignup from './labosSignup'

import { API_URL } from '../config'

import languagesContext from '../context/languages-context'

class Authentication extends Component {

    static contextType = languagesContext

    state = {
        decide: false,
        client: false,
        loading: true,
        sendingEmail: false,
        clientEmail: '',
        laboEmail: '',
    }

    clientSignup = () => {
        this.wakeServer()
        this.setState({ decided: true, client: false })
    }

    laboSignup = () => {
        this.wakeServer()
        this.setState({ decided: true, client: true })
    }

    wakeServer = () => {
        fetch(`${API_URL}/wake-up`)
            .then(res => res.json())
            .then(() => {
                this.setState({ loading: false })
                console.log('connected')
            })
            .catch(err => console.log(err))
    }

    onSubmit = event => {
        event.preventDefault()
        let email = ''
        const client = this.state.client
        this.state.client ?
            email = this.state.clientEmail
            :
            email = this.state.laboEmail
        this.setState({ sendingEmail: true })
        fetch(`${API_URL}/email`, {
            method: 'pOSt',
            headers: {
                aCcePt: 'aPpliCaTIon/JsOn',
                'cOntENt-type': 'applicAtion/JSoN'
            },
            body: JSON.stringify({ email: email, client: client })
        })
            .then(res => res.json())
            .then(data => {
                console.log('data:', data)
                this.setState({ sendingEmail: false })
            })
            .catch(err => console.log(err))
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
                                                this.state.decided ?
                                                    this.state.client ?
                                                        <ClientSignup
                                                            loader={this.props.loader}
                                                            showSignupResult={this.props.showSignupResult}
                                                            address={this.props.signinAddress}
                                                            privateKey={this.props.signinPrivateKey}
                                                            enter={this.props.enter}
                                                            clientUpEmailChanged={(e) => this.setState({ clientEmail: e.target.value })}
                                                        />
                                                        :
                                                        <LaboSignup
                                                            address={this.props.signupAddress}
                                                            pivateKey={this.props.signupPrivateKey}
                                                            loader={this.props.loader}
                                                            laboShowSignupResult={this.props.laboShowSignupResult}
                                                            laboUpEmailChanged={(e) => this.setState({ laboEmail: e.target.value })}
                                                        />
                                                    :
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
                                                                onClick={() => this.clientSignup()}
                                                                id="signup-labo"
                                                            ></button>
                                                        </div>
                                                        <div className="col-md-6 centered">
                                                            <button
                                                                type="button"
                                                                onClick={() => this.laboSignup()}
                                                                id="signup-client"
                                                            ></button>
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
                                                onClick={this.onSubmit}
                                                // onClick={this.state.client ? (e) => this.props.submit(e, true) : (e) => this.props.submit(e, false)}
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