import React, { Component } from 'react'
import { API_URL } from '../config'

import Helmet from 'react-helmet'
import logo from '../assets/LogoFdBleu@1x.png'
import signinImage from '../assets/signin-image.jpg'
import languagesContext from '../context/languages-context'
import { TRACEPIC_ADDRESS } from '../contract_ABI_Address'

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
                this.setState({ confirming: false })
                this.signupHandler(data.info)
            })
            .catch(err => console.error(err))
    }

    signupHandler = (data) => {
        this.state.signinSignup ?
            this.signinHandler()
            :
            data.client ?
                this.clientSignupHandler(data)
                :
                this.laboSignupHandler(data)
    }

    async clientSignupHandler(user) {
        this.setState({ signupLoad: true })

        const account = await this.state.web3.eth.accounts.create()
        this.setState({ accountAddress: account.address, accountPrivateKey: account.privateKey, accountName: user.name })
        const encoded_tx = this.state.contractInstance.methods.signup(
            account.address, user.name, user.email, user.password).encodeABI();
        var rawTransaction = {
            from: account.address,
            data: encoded_tx,
            to: TRACEPIC_ADDRESS,
            gas: 500000
        }
        const keystore = await this.state.web3.eth.accounts.encrypt(account.privateKey, user.password)
        // sign and send transaction
        this.state.web3.eth.accounts.signTransaction(rawTransaction, account.privateKey)
            .then(signedTx => this.state.web3.eth.sendSignedTransaction(signedTx.rawTransaction))
            .then(receipt => {
                console.log('receipt:', receipt)
                const fileName = user.name + " " + account.address
                this.keystoreDownload(fileName, JSON.stringify(keystore))
                this.setState({ accountName: user.name })
                console.log('this.state.accountAddress:', this.state.accountAddress)
                console.log('this.state.privateKey:', this.state.privateKey)
                //this.setState({ showSignupResult: true, signupLoad: false })
            })
            .catch(err => {
                this.setState({ showSignupResult: false, signupLoad: false })
                return console.error(err)
            });
    }

    // laboSignupHandler = async () => {
    //     this.setState({ signupLoad: true })
    //     if (this.state.laboSignupPassword !== this.state.laboSignupPasswordConf) {
    //         this.setState({ signupLoad: false })
    //         return console.log("Password doesn't match")
    //     }
    //     const account = await this.state.web3.eth.accounts.create()
    //     this.setState({ signupAddress: account.address, signupPrivateKey: account.privateKey })
    //     const date = new Date().getDate() + "-" + (new Date().getMonth() + 1) + "-" + new Date().getFullYear() +
    //         " " + new Date().getHours() + ":" + new Date().getMinutes() + ":" + new Date().getSeconds()
    //     const encoded_tx = this.state.contractInstance.methods.signupAsLabo(
    //         account.address, date, this.state.laboSignupName, this.state.laboSignupPhAddress, this.state.laboSignupEmail, this.state.laboSignupPassword).encodeABI();
    //     var rawTransaction = {
    //         "from": account.address,
    //         "data": encoded_tx,
    //         "to": TRACEPIC_ADDRESS,
    //         "gas": 500000
    //     }
    //     const keystore = await this.state.web3.eth.accounts.encrypt(account.privateKey, this.state.laboSignupPassword)
    //     // sign and send transaction
    //     this.state.web3.eth.accounts.signTransaction(rawTransaction, account.privateKey)
    //         .then(signedTx => this.state.web3.eth.sendSignedTransaction(signedTx.rawTransaction))
    //         .then(receipt => {
    //             console.log('receipt:', receipt)
    //             this.setState({ laboShowSignupResult: true, signupLoad: false })
    //             const fileName = this.state.laboSignupName + " " + account.address
    //             this.keystoreDownload(fileName, JSON.stringify(keystore))
    //         })
    //         .catch(err => {
    //             this.setState({ showSignupResult: false, signupLoad: false })
    //             return console.error(err)
    //         });
    // }

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