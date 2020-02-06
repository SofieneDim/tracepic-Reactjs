import { TRACEPIC_ABI, TRACEPIC_ADDRESS } from './contract_ABI_Address'
import React, { Component } from 'react'
import Web3 from 'web3'
import './App.css'

import LabosTemplate from './LabosTemplate/labosTemplate'
import UsersTemplate from './UsersTemplate/usersTemplate'
import SignInUp from './Sign-In-Up/container'

class App extends Component {

  constructor(props) {
    super(props)
    this.state = {
      web3: null,
      balance: null,
      contractInstance: null,
      analyses: [],
      accountaddress: '',
      signinEmail: '',
      signinPassword: '',
      accessApproved: false,
      laboMode: false,
      metamaskExist: false,
      signinSignup: true
    }
  }


  developSigninHandler() {
    console.log('developSigninHandler:')

    if (!true) {
      this.setState({ accountAddress: "0xBE62aD6420E3CB8493812Cd516Fdc06fa738F0f4" })
      this.labosMode()
    } else {
      this.setState({ accountAddress: "0x022c47EDdCea320fcf406eBAed22D926243FeaF9" })
      this.usersMode()
    }
    this.loadAccountInfo()
  }


  async componentDidMount() {
    await this.initContract()
  }

  async initContract() {
    const web3 = new Web3(Web3.givenProvider || "http://localhost:8545")
    this.setState({ web3 })
    const contractInstance = new web3.eth.Contract(TRACEPIC_ABI, TRACEPIC_ADDRESS)
    this.setState({ contractInstance })
  }

  async loadAccountInfo() {
    let balance = await this.state.web3.eth.getBalance(this.state.accountAddress)
    balance = this.state.web3.utils.fromWei(balance, "ether")
    this.setState({ accountAddress: this.state.accountAddress, balance })
  }

  async loadAnalyses() {
    const analysesIds = await this.state.contractInstance.methods.getAllAnalyses().call()
    const analyses = []
    for (let i = 1; i <= analysesIds.length; i++) {
      const analyse = await this.state.contractInstance.methods.analyses(i).call()
      analyses.push(analyse)
    }
    this.setState({ analyses })
  }

  async signinHandler(event) {
    event.preventDefault()
    const accountInfo = await this.state.web3.eth.accounts.privateKeyToAccount(this.state.privateKey)
    this.setState({ accountAddress: accountInfo.address, accountPrivateKey: accountInfo.privateKey })
    try {
      const accountReceipt = await this.state.contractInstance.methods
        .getAccountByAddress(this.state.accountAddress).call()
      if (accountReceipt[1] == 0x0) {
        return console.log("account doesn't exist")
      }
      if (this.state.signinEmail !== accountReceipt[3]) {
        return console.log("wrong email address")
      }
      if (this.state.signinPassword !== accountReceipt[4]) {
        return console.log("wrong password")
      }
      this.setState({ accountName: accountReceipt[2] })
      if (accountReceipt[5]) {
        this.labosMode()
      } else {
        this.usersMode()
      }
      this.loadAccountInfo()
    } catch (error) {
      console.error(error);
    }
  }

  async signupHandler(event) {
    event.preventDefault()
    if (this.state.signupPassword !== this.state.signupPasswordConf) {
      return console.log("Password doesn't match")
    }
    const account = await this.state.web3.eth.accounts.create()
    const keystore = this.state.web3.eth.accounts.encrypt(account.privateKey, this.state.signupPassword)
    const encoded_tx = this.state.contractInstance.methods
      .signup(account.address, this.state.signupUsername, this.state.signupEmail, this.state.signupPassword, false).encodeABI()
    var rawTransaction = {
      "from": account.address,
      "data": encoded_tx,
      "to": TRACEPIC_ADDRESS,
      "gas": 500000
    }
    this.state.web3.eth.accounts.signTransaction(rawTransaction, account.privateKey)
      .then(signedTx => {
        console.log('signedTx:', signedTx)
        this.state.web3.eth.sendSignedTransaction(signedTx.rawTransaction)
      })
      .then(receipt => {
        const fileName = this.state.signupUsername + " " + account.address
        this.keystoreDownload(fileName, JSON.stringify(keystore))
        this.setState({ accountAddress: account.address, accountName: this.state.signupUsername })
        this.usersMode()
        this.loadAccountInfo()
      })
      .catch(err => {
        console.error(err)
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

  render() {
    return (
      <div className="container">
        {!this.state.accessApproved ?
          <SignInUp
            web3={this.state.web3}

            signinSignup={this.state.signinSignup}
            signup={() => { this.setState({ signinSignup: !this.state.signinSignup }) }}
            submit={this.state.signinSignup ? this.signinHandler.bind(this) : this.signupHandler.bind(this)}

            inPrivateKeyChanged={(event) => { this.signinInputChanged("privateKey", event.target.value) }}
            inEmailChanged={(event) => { this.signinInputChanged("signinEmail", event.target.value) }}
            inPasswordChanged={(event) => { this.signinInputChanged("signinPassword", event.target.value) }}

            upUsernameChanged={(event) => { this.setState({ signupUsername: event.target.value }) }}
            upEmailChanged={(event) => { this.setState({ signupEmail: event.target.value }) }}
            upPasswordChanged={(event) => { this.setState({ signupPassword: event.target.value }) }}
            upPasswordConfChanged={(event) => { this.setState({ signupPasswordConf: event.target.value }) }}
          />
          : !this.labosMode ?
            <UsersTemplate
              web3={this.state.web3}
              contractInstance={this.state.contractInstance}
              analyses={this.state.analyses.reverse()}
              balance={this.state.balance}
              accountAddress={this.state.accountAddress}
              accountPrivateKey={this.state.accountPrivateKey}
              accountName={this.state.accountName}
              reloadAccountInfo={this.loadAccountInfo.bind(this)}
            />
            : <LabosTemplate
              web3={this.state.web3}
              analyses={this.state.analyses.reverse()}
              contractInstance={this.state.contractInstance}

              balance={this.state.balance}
              accountAddress={this.state.accountAddress}
              accountName={this.state.accountName}
              privateKey={this.state.privateKey}

              reloadAnalyses={this.loadAnalyses.bind(this)}
            />
        }
      </div>
    )
  }

  labosMode() {
    this.labosMode = true
    this.setState({ accessApproved: true })
    this.loadAnalyses()
  }

  usersMode() {
    this.labosMode = false
    this.setState({ accessApproved: true })
    this.loadAnalyses()
  }

  signinInputChanged(key, value) {
    this.setState({ [key]: value })
  }
}

export default App;
