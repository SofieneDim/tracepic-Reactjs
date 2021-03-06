import { TRACEPIC_ABI, TRACEPIC_ADDRESS } from './contract_ABI_Address'
import React, { Component } from 'react'
import Web3 from 'web3'
import './App.css'
import i18n from "i18next"

import LabosTemplate from './labosTemplate/labosTemplate'
import UsersTemplate from './usersTemplate/usersTemplate'
import Authentication from './authentication/authentication'
import AdminTemplate from './adminTemplate/adminTemplate'

import contractContext from './context/contract-context'
import authContext from './context/Authentication-context'
import LanguagesContext from './context/languages-context'
import { withNamespaces } from 'react-i18next'

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
    const web3 = new Web3(Web3.givenProvider || "https://tracepic-backend.trimakus.com/geth")
    const contractInstance = await new web3.eth.Contract(TRACEPIC_ABI, TRACEPIC_ADDRESS)
    await this.setState({ contractInstance, web3 })
    if (this.props.userInfo) { this.clientAuthenticated() }
  }

  clientAuthenticated = async () => {
    await this.setState({
      accountAddress: this.props.userInfo.address,
      accountPrivateKey: this.props.userInfo.privatekey,
      accountName: this.props.userInfo.name,
    })
    await this.authenticated()
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
    if (_isAdmin) {
      return this.setState({ adminMode: true, accessApproved: true })
    }
    try {
      accountReceipt = await this.state.contractInstance.methods
        .getAccountByAddress(this.state.accountAddress).call()
    } catch (error) {
      return console.error(error);
    }
    if (accountReceipt[1] == 0x0) {
      const authorized = await this.checkLaboAccount(accountReceipt[1])
      if (!authorized) { return console.log('Not authorized') }
    }
    const authorized = this.checkAuth(accountReceipt)
    //if (!authorized) { return console.log('Not authorized') }
    this.setState({ accountName: accountReceipt[2] })
    if (accountReceipt[5]) {
      this.labosMode()
    } else {
      this.usersMode()
    }
    this.loadAccountInfo()
  }

  checkLaboAccount = async () => {
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
  }

  checkAuth = accountReceipt => {
    if (accountReceipt[1] == 0x0) {
      console.log("account doesn't exist")
      return false;
    }
    if (this.state.signinEmail !== accountReceipt[3]) {
      console.log("wrong email address")
      return false;
    }
    if (this.state.signinPassword !== accountReceipt[4]) {
      console.log("wrong password")
      return false;
    }
    if (this.state.signinPassword !== accountReceipt[4]) {
      console.log("wrong password")
      return false;
    }
    return true;
  }

  render = () => {
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
                    signin={() => this.signinHandler()}
                    enter={() => this.authenticated()}
                    loader={this.state.signupLoad}
                    signinAddress={this.state.accountAddress}
                    signinPrivateKey={this.state.accountPrivateKey}
                    signupAddress={this.state.signupAddress}
                    signupPrivateKey={this.state.signupPrivateKey}
                    signinSignup={this.state.signinSignup}
                    laboShowSignupResult={this.state.laboShowSignupResult}
                    signup={() => { this.setState({ signinSignup: !this.state.signinSignup }) }}
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
                    setBalance={(balance) => this.setBalance(balance)}
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
          </LanguagesContext.Provider >
        </div >
      </div>
    )
  }

  signinInputChanged(key, value) {
    this.setState({ [key]: value })
  }

  authenticated = async () => {
    this.usersMode()
    //await this.loadAccountInfo()
    console.log('accountAddress:', this.state.accountAddress)
  }

  setAccountInfo = async (address, privatekey) => {
    console.log('accountAddress:', this.state.accountAddress)
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

  setBalance = (_balance) => {
    this.setState({ balance: _balance })
  }
}

export default withNamespaces()(App);