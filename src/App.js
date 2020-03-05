import { TRACEPIC_ABI, TRACEPIC_ADDRESS } from './contract_ABI_Address'
import React, { Component } from 'react'
import Web3 from 'web3'
import './App.css'
import i18n from "i18next"

import LabosTemplate from './labosTemplate/labosTemplate'
import UsersTemplate from './usersTemplate/usersTemplate'
import Authentication from './authentication/authentication'

import contractContext from './context/contract-context'
import authContext from './context/Authentication-context'
import LanguagesContext from './context/languages-context'
import { withNamespaces } from 'react-i18next'
import AdminTemplate from './adminTemplate/adminTemplate'

class App extends Component {

  constructor(props) {
    super(props)
    this.state = {
      web3: null,
      balance: null,
      contractInstance: null,
      analyses: [],
      adminMode: false,
      accountAddress: '',
      privateKey: '',//'0x73a6f449a306b8efc7e07f71d47824d7cfef894acb712904a812533c7d871efb',
      signinEmail: '',
      signinPassword: '',
      accessApproved: false,
      laboMode: false,
      metamaskExist: false,
      showSignupResult: false,
      laboShowSignupResult: false,
      signinSignup: true,
      signupLoad: false,
      laboSignupName: '',
      laboSignupPhAddress: '',
      laboSignupEmail: '',
      laboSignupPassword: '',
      laboSignupPasswordConf: '',
      signupAddress: '',
      signupPrivateKey: '',
    }
  }

  changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  }

  async componentDidMount() {
    await this.initContract()
  }

  async initContract() {
    const web3 = new Web3(Web3.givenProvider || "http://51.178.53.74:7755")
    this.setState({ web3 })
    const contractInstance = await new web3.eth.Contract(TRACEPIC_ABI, TRACEPIC_ADDRESS)
    this.setState({ contractInstance })
  }

  async loadAccountInfo() {
    let balance = await this.state.web3.eth.getBalance(this.state.accountAddress)
    balance = this.state.web3.utils.fromWei(balance, "ether")
    this.setState({ balance })
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

  async signinHandler() {
    const accountInfo = await this.state.web3.eth.accounts.privateKeyToAccount(this.state.privateKey)
    this.setState({ accountAddress: accountInfo.address, accountPrivateKey: accountInfo.privateKey })
    var accountReceipt = ""
    const _isAdmin = await this.state.contractInstance.methods.adminAccounts(accountInfo.address).call()
    if (_isAdmin) { return this.setState({ adminMode: true, accessApproved: true }) }
    try {
      accountReceipt = await this.state.contractInstance.methods
        .getAccountByAddress(this.state.accountAddress).call()
    } catch (error) {
      return console.error(error);
    }
    const authorized = await this.checkAccount(accountReceipt)
    if (!authorized) { return console.log('Not authorized') }
    this.setState({ accountName: accountReceipt[2] })
    if (accountReceipt[5]) {
      this.labosMode()
    } else {
      this.usersMode()
    }
    this.loadAccountInfo()
  }

  checkAccount = async (accountReceipt) => {
    const accountState = await this.state.contractInstance.methods.checkRequest(this.state.accountAddress).call()
    switch (accountState) {
      case 'null':
        console.log("account doesn't exist")
        return false
      case 'pending':
        console.log('Request pending')
        return false
      case 'approved':
        console.log('Request approved')
        return true
      case 'refused':
        console.log('Request refused')
        return false
    }
    if (accountReceipt[1] == 0x0) {
      return console.log("account doesn't exist")
    }
    if (this.state.signinEmail !== accountReceipt[3]) {
      console.log("wrong email address")
      return false
    }
    if (this.state.signinPassword !== accountReceipt[4]) {
      console.log("wrong password")
      return false
    }
    if (this.state.signinPassword !== accountReceipt[4]) {
      console.log("wrong password")
      return false
    }
  }

  async clientSignupHandler() {
    this.setState({ signupLoad: true })
    if (this.state.signupPassword !== this.state.signupPasswordConf) {
      this.setState({ signupLoad: false })
      return console.log("Password doesn't match")
    }
    const account = await this.state.web3.eth.accounts.create()
    this.setState({ accountAddress: account.address, accountPrivateKey: account.privateKey, accountName: this.state.signupUsername })
    const encoded_tx = this.state.contractInstance.methods.signup(
      account.address, this.state.signupUsername, this.state.signupEmail, this.state.signupPassword).encodeABI();
    var rawTransaction = {
      "from": account.address,
      "data": encoded_tx,
      "to": TRACEPIC_ADDRESS,
      "gas": 500000
    }
    const keystore = await this.state.web3.eth.accounts.encrypt(account.privateKey, this.state.signupPassword)
    // sign and send transaction
    this.state.web3.eth.accounts.signTransaction(rawTransaction, account.privateKey)
      .then(signedTx => this.state.web3.eth.sendSignedTransaction(signedTx.rawTransaction))
      .then(receipt => {
        console.log('receipt:', receipt)
        const fileName = this.state.signupUsername + " " + account.address
        this.keystoreDownload(fileName, JSON.stringify(keystore))
        this.setState({ accountName: this.state.signupUsername })
        console.log('this.state.accountAddress:', this.state.accountAddress)
        console.log('this.state.privateKey:', this.state.privateKey)
        this.setState({ showSignupResult: true, signupLoad: false })
      })
      .catch(err => {
        this.setState({ showSignupResult: false, signupLoad: false })
        return console.error(err)
      });
  }

  laboSignupHandler = async () => {
    this.setState({ signupLoad: true })
    if (this.state.laboSignupPassword !== this.state.laboSignupPasswordConf) {
      this.setState({ signupLoad: false })
      return console.log("Password doesn't match")
    }
    const account = await this.state.web3.eth.accounts.create()
    this.setState({ signupAddress: account.address, signupPrivateKey: account.privateKey })
    const date = new Date().getDate() + "-" + (new Date().getMonth() + 1) + "-" + new Date().getFullYear() +
      " " + new Date().getHours() + ":" + new Date().getMinutes() + ":" + new Date().getSeconds()
    const encoded_tx = this.state.contractInstance.methods.signupAsLabo(
      account.address, date, this.state.laboSignupName, this.state.laboSignupPhAddress, this.state.laboSignupEmail, this.state.laboSignupPassword).encodeABI();
    var rawTransaction = {
      "from": account.address,
      "data": encoded_tx,
      "to": TRACEPIC_ADDRESS,
      "gas": 500000
    }
    const keystore = await this.state.web3.eth.accounts.encrypt(account.privateKey, this.state.laboSignupPassword)
    // sign and send transaction
    this.state.web3.eth.accounts.signTransaction(rawTransaction, account.privateKey)
      .then(signedTx => this.state.web3.eth.sendSignedTransaction(signedTx.rawTransaction))
      .then(receipt => {
        console.log('receipt:', receipt)
        this.setState({ laboShowSignupResult: true, signupLoad: false })
        const fileName = this.state.laboSignupName + " " + account.address
        this.keystoreDownload(fileName, JSON.stringify(keystore))
      })
      .catch(err => {
        this.setState({ showSignupResult: false, signupLoad: false })
        return console.error(err)
      });
  }

  signupHandler = (event, _client) => {
    event.preventDefault()
    this.state.signinSignup ?
      this.signinHandler()
      :
      _client ?
        this.clientSignupHandler()
        :
        this.laboSignupHandler()
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
    const { t } = this.props
    return (
      <div>
        <div style={{ float: "right" }}>
          <button
            className="btn btn-info"
            style={{ width: "50px" }}
            onClick={() => this.changeLanguage('fr')}
          >fr</button>
          <button
            className="btn btn-primary"
            style={{ width: "50px" }}
            onClick={() => this.changeLanguage('en')}
          >en</button>
        </div >
        <div className="container" >
          <LanguagesContext.Provider value={
            {
              setFR: () => this.changeLanguage('fr'),
              setEN: () => this.changeLanguage('en'),
              t: t
            }
          } >
            {!this.state.accessApproved ?
              <contractContext.Provider value={
                {
                  contractInstance: this.state.contractInstance,
                  web3: this.state.web3,
                  setFR: () => this.changeLanguage('fr'),
                  setEN: () => this.changeLanguage('en'),
                  t: t
                }
              }>
                <authContext.Provider value={
                  {
                    inPrivateKeyChanged: event => this.signinInputChanged("privateKey", event.target.value),
                    inEmailChanged: event => this.signinInputChanged("signinEmail", event.target.value),
                    inPasswordChanged: event => this.signinInputChanged("signinPassword", event.target.value),
                    upUsernameChanged: event => this.setState({ signupUsername: event.target.value }),
                    upEmailChanged: event => this.setState({ signupEmail: event.target.value }),
                    upPasswordChanged: event => this.setState({ signupPassword: event.target.value }),
                    upPasswordConfChanged: event => this.setState({ signupPasswordConf: event.target.value }),
                    laboUpNameChanged: (e) => this.setState({ laboSignupName: e.target.value }),
                    laboUpAddressChanged: (e) => this.setState({ laboSignupPhAddress: e.target.value }),
                    laboUpEmailChanged: (e) => this.setState({ laboSignupEmail: e.target.value }),
                    laboUpPasswordChanged: (e) => this.setState({ laboSignupPassword: e.target.value }),
                    laboUpPasswordConfChanged: (e) => this.setState({ laboSignupPasswordConf: e.target.value }),
                    setAccountInfo: (address, privatekey) => this.setAccountInfo(address, privatekey)
                  }
                }>
                  <Authentication
                    enter={this.authenticated}
                    loader={this.state.signupLoad}
                    signinAddress={this.state.accountAddress}
                    signinPrivateKey={this.state.accountPrivateKey}
                    signupAddress={this.state.signupAddress}
                    signupPrivateKey={this.state.signupPrivateKey}
                    signinSignup={this.state.signinSignup}
                    showSignupResult={this.state.showSignupResult}
                    laboShowSignupResult={this.state.laboShowSignupResult}
                    signup={() => { this.setState({ signinSignup: !this.state.signinSignup }) }}
                    submit={(e, b) => this.signupHandler(e, b)}
                  />
                </authContext.Provider >
              </contractContext.Provider >
              :
              this.state.adminMode ?
                <AdminTemplate
                  web3={this.state.web3}
                  contractInstance={this.state.contractInstance}
                  accountAddress={this.state.accountAddress}
                  privateKey={this.state.privateKey}
                />
                :
                this.labosMode ?
                  <LabosTemplate
                    web3={this.state.web3}
                    analyses={this.state.analyses.reverse()}
                    contractInstance={this.state.contractInstance}
                    balance={this.state.balance}
                    accountAddress={this.state.accountAddress}
                    accountName={this.state.accountName}
                    privateKey={this.state.privateKey}
                    reloadAnalyses={this.loadAnalyses.bind(this)}
                    setAccountInfo={this.setAccountInfo}
                  />
                  :
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
            }
            {/* <AdminTemplate
              web3={this.state.web3}
              contractInstance={this.state.contractInstance}
            />*/}
          </LanguagesContext.Provider >
        </div >
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

  authenticated = () => {
    this.usersMode()
    this.loadAccountInfo()
  }

  setAccountInfo = async (address, privatekey) => {
    await this.setState({ accountAddress: address, accountPrivateKey: privatekey })
    this.loadAccountInfo()
    let accountReceipt = []
    try {
      accountReceipt = await this.state.contractInstance.methods
        .getAccountByAddress(address).call()
    } catch (error) {
      return console.error(error);
    }
    this.setState({ accountName: accountReceipt[2] })
    if (accountReceipt[5]) {
      this.labosMode()
    } else {
      this.usersMode()
    }
  }

  setAccountInfo = (_balance) => {
    this.setState({ balance: _balance })
  }
}

export default withNamespaces()(App);