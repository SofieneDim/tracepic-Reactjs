import React, { Component } from 'react'
import { API_URL } from '../../config'

import Helmet from 'react-helmet'
import logo from '../../assets/LogoFdBleu@1x.png'
import signinImage from '../../assets/signin-image.jpg'
import languagesContext from '../../context/languages-context'
import { TRACEPIC_ADDRESS } from '../../contract_ABI_Address'
import App from '../../App'

export default class Confirm extends Component {

    static contextType = languagesContext

    state = {
        confirming: true,
        isClientAuthenticated: false,
    }

    componentDidMount = async () => {
        const { id } = this.props.params
        await fetch(`${API_URL}/email/confirm/${id}`)
            .then(res => res.json())
            .then(data => {
                console.log('data:', data.info)
                if (data.msg === "Your email was already confirmed") {
                    return console.log("Your email was already confirmed")
                }
                if (data.info.name == undefined) { return console.log('no info') }
                this.signupHandler(data.info)
            })
            .catch(err => console.error(err))
    }

    signupHandler = (data) => {
        console.log('data:', data)
        this.state.signinSignup ?
            this.signinHandler()
            :
            data.client ?
                this.clientSignupHandler(data)
                :
                this.laboSignupHandler(data)
    }

    async clientSignupHandler(user) {
        console.log('user:', user)
        this.setState({ signupLoad: true })
        const account = await this.props.web3.eth.accounts.create()
        this.setState({ accountAddress: account.address, accountPrivateKey: account.privateKey, accountName: user.name })
        const encoded_tx = this.props.contractInstance.methods.signup(
            account.address, user.name, user.email, user.password).encodeABI();
        var rawTransaction = {
            from: account.address,
            data: encoded_tx,
            to: TRACEPIC_ADDRESS,
            gas: 500000
        }
        const keystore = await this.props.web3.eth.accounts.encrypt(account.privateKey, user.password)
        // sign and send transaction
        this.props.web3.eth.accounts.signTransaction(rawTransaction, account.privateKey)
            .then(signedTx => this.props.web3.eth.sendSignedTransaction(signedTx.rawTransaction))
            .then(receipt => {
                console.log('receipt:', receipt)
                const fileName = user.name + " " + account.address
                this.keystoreDownload(fileName, JSON.stringify(keystore))
                this.setState({ accountName: user.name })
                this.setState({ showSignupResult: true, signupLoad: false })
            })
            .catch(err => {
                this.setState({ showSignupResult: false, signupLoad: false })
                return console.error(err)
            });
    }

    laboSignupHandler = async (user) => {
        console.log('user:', user)
        this.setState({ signupLoad: true })
        const account = await this.props.web3.eth.accounts.create()
        this.setState({ accountAddress: account.address, accountPrivateKey: account.privateKey })
        const date = new Date().getDate() + "-" + (new Date().getMonth() + 1) + "-" + new Date().getFullYear() +
            " " + new Date().getHours() + ":" + new Date().getMinutes() + ":" + new Date().getSeconds()
        const encoded_tx = this.props.contractInstance.methods.signupAsLabo(
            account.address, date, user.name, user.phAddress, user.email, user.password).encodeABI();
        var rawTransaction = {
            "from": account.address,
            "data": encoded_tx,
            "to": TRACEPIC_ADDRESS,
            "gas": 500000
        }
        const keystore = await this.props.web3.eth.accounts.encrypt(account.privateKey, user.password)
        // sign and send transaction
        this.props.web3.eth.accounts.signTransaction(rawTransaction, account.privateKey)
            .then(signedTx => this.props.web3.eth.sendSignedTransaction(signedTx.rawTransaction))
            .then(receipt => {
                console.log('receipt:', receipt)
                this.setState({ confirming: false, signupLoad: false })
                const fileName = user.name + " " + account.address
                this.keystoreDownload(fileName, JSON.stringify(keystore))
            })
            .catch(err => {
                this.setState({ showSignupResult: false, signupLoad: false })
                return console.error(err)
            });
    }

    async keystoreDownload(_filename, _content) {
        let element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(_content));
        element.setAttribute('download', _filename);
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    }

    render = () => {

        const { t } = this.context // context not provided

        if (!this.state.isClientAuthenticated) {
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
                                    {!this.state.showSignupResult ?
                                        this.state.confirming ?
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
                                                <h4 className="col-md-12 centered" style={{ marginTop: '20px' }}>address:</h4>
                                                <label className="col-md-12 centered" style={{ marginTop: '20px' }}>{this.state.accountAddress}</label>
                                                <h4 className="col-md-12 centered" style={{ marginTop: '20px' }}>Private Key:</h4>
                                                <label className="col-md-12 centered" style={{ marginTop: '20px' }}>{this.state.accountPrivateKey}</label>
                                            </div>
                                        :
                                        <div className="row centered" style={{ marginTop: '20px' }}>
                                            <h3 className="col-md-12 centered" style={{ marginTop: '20px' }}>Welcome to Tracepic !</h3>
                                            <h4 className="col-md-12 centered" style={{ marginTop: '20px' }}>address:</h4>
                                            <label className="col-md-12 centered" style={{ marginTop: '20px' }}>{this.state.accountAddress}</label>
                                            <h4 className="col-md-12 centered" style={{ marginTop: '20px' }}>Private Key:</h4>
                                            <label className="col-md-12 centered" style={{ marginTop: '20px' }}>{this.state.accountPrivateKey}</label>
                                            <div className="col-md-12 centered" style={{ marginTop: '20px' }}>
                                                <button
                                                    className="btn btn-success centered"
                                                    style={{ marginBottom: '20px' }}
                                                    onClick={() => this.setState({ isClientAuthenticated: true })}
                                                >
                                                    Enter
                                            </button>
                                            </div>
                                        </div>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div >
            )
        } else {
            return (
                <App
                    userInfo={
                        {
                            address: this.state.accountAddress,
                            privatekey: this.state.accountPrivateKey,
                            name: this.state.accountName
                        }}
                />
            )
        }
    }
}