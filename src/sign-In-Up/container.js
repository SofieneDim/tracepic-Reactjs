import React, { Component } from 'react'
import Helmet from 'react-helmet'
import './SignInUp.css'

import logo from '../imgs/LogoFdBleu@1x.png'
import signinImage from '../imgs/signin-image.jpg'
import Signin from './signin'
import Signup from './signup'

class SignInUp extends Component {

    constructor(props) {
        super(props)
        this.state = {

        }
    }

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
                            <div className="col-md-3 centered">
                                <img src={signinImage} alt="" />
                            </div>
                            <div className="col-md-8">
                                <form onSubmit={this.props.click}>
                                    <div>
                                        <div className="row">
                                            <div className="col-md-1"></div>
                                            {this.props.signinSignup ?
                                                <Signin
                                                    web3={this.props.web3}
                                                    inAddressChanged={this.props.inAddressChanged}
                                                    inEmailChanged={this.props.inEmailChanged}
                                                    inPasswordChanged={this.props.inPasswordChanged}
                                                />
                                                :
                                                <Signup
                                                    upUsernameChanged={this.props.upUsernameChanged}
                                                    upEmailChanged={this.props.upEmailChanged}
                                                    upPasswordChanged={this.props.upPasswordChanged}
                                                    upPasswordConfChanged={this.props.upPasswordConfChanged}
                                                    
                                                    
                                                    
                                                />
                                            }
                                            <div className="col-md-1"></div>
                                        </div>
                                    </div>
                                    <div className="modal-footer">
                                        <h3 id="signin_warning" style={{ color: 'red' }}></h3>
                                        <button className="btn btn-primary" type="button"
                                            style={{ backgroundColor: '#3384CC' }} onClick={this.props.signup}
                                        >{this.props.signinSignup ? "Go to Sign Up" : "Go to Sign In"}</button>
                                        <button className="btn btn-primary signin_botton" type="submit"
                                            onClick={this.props.click}
                                            style={{ backgroundColor: '#3333CC' }}
                                        >Connect</button>
                                        <div className="centered">
                                            <button className="btn btn-primary" style={{ display: 'none', backgroundColor: '#3333CC' }}>Done!</button>
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