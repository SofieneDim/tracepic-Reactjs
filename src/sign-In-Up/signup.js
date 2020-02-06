import React, { Component } from 'react'
import AuthContext from '../context/Authentication-context'

class signup extends Component {

    constructor(props) {
        super(props)
        this.state = {
        }
    }

    componentDidMount() {
        this.userNameInput.focus()
    }

    render() {
        return (
            <div className="row col-md-10" style={{ marginBottom: "40px" }}>
                <AuthContext.Consumer>
                    {
                        context =>
                            <div className="row col-md-12">
                                <div className="col-md-12">
                                    <div className="form-group" style={{ marginTop: '20px' }}>
                                        <label htmlFor="signup-username" className="centered">Username</label>
                                        <input type="text" className="form-control"
                                            id="signup-username"
                                            placeholder="Enter your username"
                                            ref={_inputRef => this.userNameInput = _inputRef}
                                            onChange={context.upUsernameChanged}
                                        />
                                    </div>
                                </div>
                                <div className="col-md-12">
                                    <div className="form-group" style={{ marginTop: '20px' }}>
                                        <label htmlFor="signup-email" className="centered">E-mail</label>
                                        <input type="text" className="form-control"
                                            id="signup-email"
                                            placeholder="Enter your e-mail"
                                            onChange={context.upEmailChanged}
                                        />
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-group" style={{ marginTop: '20px' }}>
                                        <label htmlFor="signup-password" className="centered">Password</label>
                                        <input type="text" className="form-control"
                                            id="-signup-password"
                                            placeholder="Enter your password"
                                            onChange={context.upPasswordChanged}
                                        />
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-group" style={{ marginTop: '20px' }}>
                                        <label htmlFor="signup-password-cnf" className="centered">Confirm your password</label>
                                        <input type="text" className="form-control"
                                            id="signup-password-cnf"
                                            placeholder="Renter your password"
                                            onChange={context.upPasswordConfChanged}
                                        />
                                    </div>
                                </div>
                            </div>
                    }
                </AuthContext.Consumer>
            </div>
        )
    }
}

export default signup;