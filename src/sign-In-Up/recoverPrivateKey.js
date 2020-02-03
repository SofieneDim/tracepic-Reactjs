import React, { Component } from 'react'

class RecoverPrivateKey extends Component {

    constructor(props) {
        super(props)
        this.state = {
            keystorePassword: ''
        }
    }

    readKeyStore() {
        const keystore = document.getElementById("keystoreFile").files[0]
        const web3 = this.props.web3
        const keystorePassword = this.state.keystorePassword
        if (keystore == undefined) { return console.log("Please upload your key-store") }
        const fileReader = new FileReader();
        fileReader.onload = (fileLoadedEvent) => {
            const textFromFileLoaded = fileLoadedEvent.target.result
            try {
                const decryptedAccount = web3.eth.accounts.decrypt(textFromFileLoaded, keystorePassword)
                this.setState({ addressResult: decryptedAccount.address, privateKeyResult: decryptedAccount.privateKey })
            } catch (error) {
                return console.error(error)
            }
        }
        fileReader.readAsText(keystore, "UTF-8");
    }

    render() {

        return (
            <div id="recover-address-privatekey">
                <div className="row">
                    <div className="col-md-12" style={{ marginTop: 28, marginBottom: 20 }}>
                        <input type="file" id="keystoreFile" />
                    </div>
                    <div className="col-md-6">
                        <label htmlFor="password_keystore">Password</label>
                        <input type="password" className="form-control"
                            placeholder="Type your password" required
                            onChange={(event) => this.setState({ keystorePassword: event.target.value })}
                        />
                    </div>
                    <div className="col-md-12">
                        <div className="row" style={{ marginTop: 20 }}>
                            <div className="col-md-4">
                                <button className="btn btn-info" type="button"
                                    style={{ marginBottom: 20 }}
                                    onClick={this.readKeyStore.bind(this)}
                                >Get Private Key</button>
                            </div>
                            <div className="col-md-2">
                                <div className="analyse-loader" style={{ display: 'none' }} />
                            </div>
                            <div className="col-md_5" style={{ display: 'none' }}>
                                <p style={{ color: 'rgb(17, 133, 168)' }}>(This may take a while)</p>
                            </div>
                        </div>
                    </div>
                </div>
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
                </div>
            </div>
        )
    }
}

export default RecoverPrivateKey;