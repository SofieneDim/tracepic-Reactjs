import React, { Component } from 'react'
import { API_URL } from '../config'

import Helmet from 'react-helmet'
import logo from '../assets/LogoFdBleu@1x.png'
import signinImage from '../assets/signin-image.jpg'
import languagesContext from '../context/languages-context'

export default class Confirm extends Component {

    static contextType = languagesContext

    state = {
        confirming: true,
    }

    componentDidMount = () => {
        const { id } = this.props.match.params
        fetch(`${API_URL}/email/confirm/${id}`)
            .then(res => res.json())
            .then(data => {
                console.log('data:', data)
                this.setState({ confirming: false })
            })
            .catch(err => console.log(err))
    }

    render = () => {

        const { t } = this.context

        return (
            <div className='container' >
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
                                <div className="col-md-12 centered" style={{ marginTop: '20px' }}></div>
                                <div className="col-md-12 centered">
                                    <img src={signinImage} alt="" />
                                </div>
                            </div>
                            <div className="col-md-8">
                                {this.state.confirming ?
                                    <div className="row" style={{ marginTop: '1%' }}>
                                        <h1 className="centered col-md-12" style={{ color: 'rgb(49, 54, 203, 0.9)' }}>
                                            Confirmation in progress
                                        </h1>
                                        <div className="centered col-md-12" style={{ marginTop: '20px' }}>
                                            <div className="loader"></div>
                                        </div>
                                    </div>
                                    :
                                    <div className="row" style={{ marginTop: '10%' }}>
                                        <h2 className="col-md-12 centered" style={{ color: 'blue', marginTop: '20px' }}>Your email has been successfully verified.</h2>
                                        <h3 className="col-md-12 centered" style={{ color: 'green', marginTop: '20px' }}>We successfully received your demand,</h3>
                                        <h4 className="col-md-12 centered" style={{ color: 'green' }}>and we will approve it as soon as possible</h4>
                                    </div>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div >
        )
    }
}