import React, { Component } from 'react'
import privateKeyRecovery from '../assets/privateKeyRecovery.png'

import ContractContext from '../context/contract-context'

class RecoverPrivateKey extends Component {

    static contextType = ContractContext

    constructor(props) {
        super(props)
        this.state = {
            keystorePassword: '',
            loading: false,
            finish: false,
            addressResult: '',
            privateKeyResult: ''
        }
    }

    readKeyStore = async () => {
        const keystore = document.getElementById("keystoreFile").files[0]
        const web3 = this.context.web3
        const keystorePassword = this.state.keystorePassword
        if (!this.state.keystorePassword) { return console.log("Please upload your key-store") }
        if (keystore == undefined) { return console.log("Please re-upload your key-store") }
        await this.setState({ loading: true, finish: false })
        let fileReader = new FileReader()
        let decryptedAccount = null
        fileReader.onload = (fileLoadedEvent) => {
            const textFromFileLoaded = fileLoadedEvent.target.result
            try {
                decryptedAccount = web3.eth.accounts.decrypt(textFromFileLoaded, keystorePassword)
            } catch (error) {
                return console.error(error)
            }
            this.setState({
                addressResult: decryptedAccount.address,
                privateKeyResult: decryptedAccount.privateKey,
                loading: false,
                finish: true
            })
        }
        fileReader.readAsText(keystore, "UTF-8");
    }

    render() {

        return (
            <div id="recover-address-privatekey">
                <div className="row">
                    <div className="col-md-8" >
                        <div className="col-md-12" >
                            <button type='button'
                                id="private-recover-back"
                                onClick={this.props.cancel}
                            />
                        </div>
                        <div className="col-md-12" style={{ marginTop: 28, marginBottom: 20 }}>
                            <input type="file" id="keystoreFile" required />
                        </div>
                        <div className="col-md-12" style={{ marginTop: 30 }}>
                            <label htmlFor="password_keystore">
                                <b>{this.context.t('password')}</b>
                            </label>
                            <input type="password" className="form-control"
                                placeholder={this.context.t('password_placeholder')}
                                onChange={(event) => this.setState({ keystorePassword: event.target.value })}
                                required
                            />
                        </div>
                    </div>
                    <div className="col-md-4" style={{ marginTop: '70px' }}>
                        <img src={privateKeyRecovery} id='privateKeyRecovery' />
                    </div>
                </div>
                <div className="col-md-12">
                    <div className="row" style={{ marginTop: 10 }}>
                        <div className="col-md-4">
                            <button
                                className="btn btn-info" type="button"
                                style={{ marginBottom: 20 }}
                                onClick={this.readKeyStore.bind(this)}
                            > {this.context.t('getPrivateKey')} </button>
                        </div>
                        {
                            this.state.loading ?
                                <div className="row col-md-8">
                                    <div className="col-md-2">
                                        <div className="analyse-loader" />
                                    </div>
                                    <div className="col-md_5">
                                        <p style={{ color: 'rgb(17, 133, 168)' }}>(This may take a while)</p>
                                    </div>
                                </div>
                                : null
                        }
                    </div>
                </div>
                {
                    this.state.finish ?
                        <div className="row">
                            <div className="col-md-12 mb-3 centered">
                                <strong className="centered">Address:</strong>
                            </div>
                            <div className="col-md-12 mb-3 centered">
                                <p className="" />{this.state.addressResult}
                            </div>
                            <div className="col-md-12 mb-3 centered">
                                <strong className="centered">Private Key:</strong>
                            </div>
                            <div className="col-md-12 mb-3 centered">
                                <p />{this.state.privateKeyResult}
                            </div>
                            {/* <div className="col-md-12 mb-3 centered">
                                <button
                                    className="btn btn-success"
                                    onClick={() => this.props.enter(this.state.addressResult, this.state.privateKeyResult)}
                                    type="button"
                                >
                                    {this.context.t('enter')}
                                </button>
                            </div> */}
                        </div>
                        : null
                }
            </div>
        )
    }
}

export default RecoverPrivateKey;