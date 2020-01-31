import React, { Component } from 'react'

class signup extends Component {

    constructor(props) {
        super(props)
        this.state = {

        }
    }

    render() {
        return (
            <div className="row col-md-10">
                <div className="col-md-12">
                    <div className="form-group" style={{ marginTop: '20px' }}>
                        <label htmlFor="signup-username" className="centered">Username</label>
                        <input type="text" className="form-control"
                            id="signup-username"
                            placeholder="Enter your username"
                            onChange={this.props.upUsernameChanged}
                        />
                    </div>
                </div>
                <div className="col-md-12">
                    <div className="form-group" style={{ marginTop: '20px' }}>
                        <label htmlFor="signup-email" className="centered">E-mail</label>
                        <input type="text" className="form-control"
                            id="signup-email"
                            placeholder="Enter your e-mail"
                            onChange={this.props.upEmailChanged}
                        />
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="form-group" style={{ marginTop: '20px' }}>
                        <label htmlFor="signup-password" className="centered">Password</label>
                        <input type="text" className="form-control"
                            id="-signup-password"
                            placeholder="Enter your password"
                            onChange={this.props.upPasswordChanged}
                        />
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="form-group" style={{ marginTop: '20px' }}>
                        <label htmlFor="signup-password-cnf" className="centered">Confirm your password</label>
                        <input type="text" className="form-control"
                            id="signup-password-cnf"
                            placeholder="Renter your password"
                            onChange={this.props.upPasswordConfChanged}
                        />
                    </div>
                </div>
            </div>
        )
    }
}

export default signup;