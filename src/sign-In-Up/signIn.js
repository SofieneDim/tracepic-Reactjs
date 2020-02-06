import React, { Component } from 'react'
import RecoverPrivateKey from './recoverPrivateKey';
import AuthContext from '../context/Authentication-context';

class signin extends Component {

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
        return (
            <div className="col-md-10">
                {!this.state.recoverPrivateKey ?
                    <div id="sign-in-up-template">
                        <AuthContext.Consumer>
                            {
                                context =>
                                    <div>
                                        <div className="form-group" style={{ marginTop: '20px' }}>
                                            <label htmlFor="signIn-account-address" className="centered">Private Key</label>
                                            <input type="text" className="form-control"
                                                id="signIn-account-address"
                                                placeholder="Enter your address"
                                                ref={_inputRef => this.privateKeyInput = _inputRef}
                                                onChange={context.inPrivateKeyChanged}
                                                required
                                            />
                                            <small id="emailHelp" className="form-text text-muted">Address must begin with: 0x</small>
                                        </div>
                                        <div className="form-group" style={{ marginTop: '20px' }}>
                                            <label htmlFor="signIn-account-email" className="centered">Email address</label>
                                            <input type="email" className="form-control"
                                                id="signIn-account-email" aria-describedby="emailHelp"
                                                placeholder="Enter your E-mail"
                                                onChange={context.inEmailChanged}
                                                required
                                            />
                                            <small id="emailHelp" className="form-text text-muted">We'll never share your email with anyone else.</small>
                                        </div>
                                        <div className="form-group" style={{ marginTop: '20px' }}>
                                            <label htmlFor="signIn-account-password" className="centered">Password</label>
                                            <input type="password" className="form-control"
                                                id="signIn-account-password"
                                                placeholder="Enter your password"
                                                onChange={context.inPasswordChanged}
                                                required
                                            />
                                        </div>
                                    </div>

                            }
                        </AuthContext.Consumer>
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
                        <a href="#" onClick={() => this.setState({ recoverPrivateKey: true })}>Private_Key Forgotten</a>
                    </div>
                    :
                    <RecoverPrivateKey
                        cancel={() => this.setState({ recoverPrivateKey: false })}
                    />
                }
            </div>
        )
    }
}

export default signin;