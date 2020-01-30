import React from 'react'
import Helmet from 'react-helmet'
import './SignInUp.css'

import logo from '../imgs/LogoFdBleu@1x.png'
import signinImage from '../imgs/signin-image.jpg'

const SignIn = (props) => {

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
                            <form onSubmit={props.click}>
                                <div>
                                    <div className="row">
                                        <div className="col-md-1"></div>
                                        {props.signinSignup ?
                                            <div className="col-md-10">
                                                <div>
                                                    <div className="form-group" style={{ marginTop: '20px' }}>
                                                        <label htmlFor="signIn-account-address" className="centered">Account address</label>
                                                        <input type="text" className="form-control"
                                                            id="signIn-account-address"
                                                            placeholder="Enter your address"
                                                            onChange={props.inAddressChanged}
                                                        />
                                                        <small id="emailHelp" className="form-text text-muted">Address must begin with: 0x</small>
                                                    </div>
                                                    <div className="form-group" style={{ marginTop: '20px' }}>
                                                        <label htmlFor="signIn-account-email" className="centered">Email address</label>
                                                        <input type="email" className="form-control"
                                                            id="signIn-account-email" aria-describedby="emailHelp"
                                                            placeholder="Enter your E-mail"
                                                            onChange={props.inEmailChanged} />
                                                        <small id="emailHelp" className="form-text text-muted">We'll never share your email with anyone else.</small>
                                                    </div>
                                                    <div className="form-group" style={{ marginTop: '20px' }}>
                                                        <label htmlFor="signIn-account-password" className="centered">Password</label>
                                                        <input type="password" className="form-control"
                                                            id="signIn-account-password"
                                                            placeholder="Enter your password"
                                                            onChange={props.inPasswordChanged} />
                                                    </div>
                                                </div>
                                                <div className="row" style={{ marginTop: '28px', display: 'none' }}>
                                                    <div className="col-md-4">
                                                        <input type="file" id="keystore-file" />
                                                    </div>
                                                    <div className="col-md-8">
                                                        <label >Password</label>
                                                        <input type="password" className="form-control"
                                                            id="password_keystore" placeholder="Type your password" />
                                                    </div>
                                                    <div className="col-md-12">
                                                        <div className="row" style={{ marginTop: '20px' }}>
                                                            <div className="col-md-4">
                                                                <button className="btn btn-info" type="button" style={{ marginBottom: '20px' }}>Get Private Key </button>
                                                            </div>
                                                            <div className="col-md-2">
                                                                <div className="analyse-loader" id="key_store_loader" style={{ display: 'none' }}></div>
                                                            </div>
                                                            <div className="col-md_5" id="key_store_message" style={{ display: 'none' }}>
                                                                <p style={{ color: 'rgb(17, 133, 168)' }}>(This may take a while)</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="row" id="keyStoreResult" style={{ display: 'none' }}>
                                                    <div className="col-md mb-3">
                                                        <strong className="centered">Address:</strong>
                                                        <p id="keyStoreResult_address" style={{ wordBreak: 'break-all' }}></p><br />
                                                        <strong className="centered">Private Key:</strong>
                                                        <p id="keyStoreResult_key" style={{ wordBreak: 'break-all' }}></p><br />
                                                    </div>
                                                </div>
                                                <a >Private_Key Forgotten</a>
                                            </div>
                                            :
                                            <div className="row col-md-10">
                                                <div class="col-md-12">
                                                    <div className="form-group" style={{ marginTop: '20px' }}>
                                                        <label htmlFor="signup-username" className="centered">Username</label>
                                                        <input type="text" className="form-control"
                                                            id="signup-username"
                                                            placeholder="Enter your username"
                                                            onChange={props.upUsernameChanged}
                                                        />
                                                    </div>
                                                </div>
                                                <div class="col-md-12">
                                                    <div className="form-group" style={{ marginTop: '20px' }}>
                                                        <label htmlFor="signup-email" className="centered">E-mail</label>
                                                        <input type="text" className="form-control"
                                                            id="signup-email"
                                                            placeholder="Enter your e-mail"
                                                            onChange={props.upEmailChanged}
                                                        />
                                                    </div>
                                                </div>
                                                <div class="col-md-6">
                                                    <div className="form-group" style={{ marginTop: '20px' }}>
                                                        <label htmlFor="signup-password" className="centered">Password</label>
                                                        <input type="text" className="form-control"
                                                            id="-signup-password"
                                                            placeholder="Enter your password"
                                                            onChange={props.upPasswordChanged}
                                                        />
                                                    </div>
                                                </div>
                                                <div class="col-md-6">
                                                    <div className="form-group" style={{ marginTop: '20px' }}>
                                                        <label htmlFor="signup-password-cnf" className="centered">Confirm your password</label>
                                                        <input type="text" className="form-control"
                                                            id="signup-password-cnf"
                                                            placeholder="Renter your password"
                                                            onChange={props.upPasswordConfChanged}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        }
                                        <div className="col-md-1"></div>
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <h3 id="signin_warning" style={{ color: 'red' }}></h3>
                                    <button className="btn btn-primary" type="button"
                                        style={{ backgroundColor: '#3384CC' }} onClick={props.signup}
                                    >{ props.signinSignup ? "Go to Sign Up" : "Go to Sign In"}</button>
                                    <button className="btn btn-primary signin_botton" type="submit"
                                        onClick={props.click}
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

export default SignIn;