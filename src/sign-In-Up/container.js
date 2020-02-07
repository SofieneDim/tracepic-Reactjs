import React, { Component } from 'react'
import Helmet from 'react-helmet'
import './signInUp.css'

import logo from '../imgs/LogoFdBleu@1x.png'
import signinImage from '../imgs/signin-image.jpg'
import Signin from './signin'
import Signup from './signup'

class SignInUp extends Component {

    render() {

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
                                <div className="col-md-12 centered" style={{ marginTop: '20px'}}>
                                    <h2 id='sign-in-up-title'>{this.props.signinSignup ? "Sign In" : "Sign Up"}</h2>
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
                                            { this.props.signinSignup ? <Signin/> : <Signup/> }
                                            <div className="col-md-1"></div>
                                        </div>
                                    </div>
                                    <div className="row modal-footer">
                                        <div className='col-md-3'>
                                            <button className="btn btn-primary" type="button"
                                                style={{ backgroundColor: '#3384CC', float: 'left' }} onClick={this.props.signup}
                                            >{this.props.signinSignup ? "Go to Sign Up" : "Go to Sign In"}</button>
                                        </div>
                                        <div className='col-md-8'>
                                            <button className="btn btn-primary signin_botton" type="submit"
                                                onClick={this.props.submit}
                                                style={{ backgroundColor: '#3333CC', float: 'right' }}
                                            >Connect</button>
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

export default SignInUp;