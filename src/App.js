import { TRACEPIC_ABI, TRACEPIC_ADDRESS } from './contract_ABI_Address'
import React, { Component } from 'react'
import Web3 from 'web3'
import './App.css'

import LabosTemplate from './LabosTemplate/labosTemplate'
import UsersTemplate from './UsersTemplate/usersTemplate'
import SignIn from './Sign-In-Up/signIn'



class App extends Component {

  constructor(props) {
    super(props)
    this.state = {
      balance: null,
      contractInstance: null,
      analyses: [],
      signinAddress: '',
      signinEmail: '',
      signinPassword: '',
      accessApproved: false,
      laboMode: false,
      metamaskExist: false,
      web3: null
    }
  }


  developSigninHandler() {

    if (true) {

      this.setState({ accountAddress: "0xBE62aD6420E3CB8493812Cd516Fdc06fa738F0f4" })
      this.labosMode()
    } else {
      this.setState({ accountAddress: "0x022c47EDdCea320fcf406eBAed22D926243FeaF9" })
      this.usersMode()
    }
    this.loadAccountInfo()
  }


  componentDidMount() {
    this.initContract()
  }

  async initContract() {
    const web3 = new Web3(Web3.givenProvider || "http://localhost:7545")
    this.setState({ web3 })
    const contractInstance = new web3.eth.Contract(TRACEPIC_ABI, TRACEPIC_ADDRESS)
    this.setState({ contractInstance })
  }

  async loadAccountInfo() {
    // if (this.statemetamaskExist){
    // const accounts = await web3.eth.getAccounts()
    // const balance = await web3.eth.getBalance(accounts[0])
    // this.setState({ accountAddress: accounts[0], balance })
    // } else {

    // let balance = await this.state.web3.eth.getBalance(this.state.signinAddress)
    // balance = this.state.web3.utils.fromWei(balance, "ether")
    // this.setState({ accountAddress: this.state.signinAddress, balance })

    // }
  }

  async loadAnalyses() {
    const analysesIds = await this.state.contractInstance.methods.getAllAnalyses().call()
    const analyses = []
    for (let i = 1; i <= analysesIds.length; i++) {
      analyses.push(await this.state.contractInstance.methods.analyses(i).call())
    }
    this.setState({ analyses })
  }

  async signin(event) {
    event.preventDefault()
    try {
      const accountReceipt = await this.state.contractInstance.methods
        .getAccountByAddress(this.state.signinAddress).call()

      if (accountReceipt[1] == 0x0) {
        return console.log("account doesn't exist")
      }

      if (this.state.signinEmail !== accountReceipt[3]) {
        return console.log("wrong email address")
      }

      if (this.state.signinPassword !== accountReceipt[4]) {
        return console.log("wrong password")
      }
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

  render() {
    return (
      <div className="container">
        {!this.state.accessApproved ?
          <SignIn

          develop={this.developSigninHandler.bind(this)} //*****************

            click={this.signin.bind(this)}
            addressChanged={(event) => { this.signinInputChanged("signinAddress", event.target.value) }}
            emailChanged={(event) => { this.signinInputChanged("signinEmail", event.target.value) }}
            passwordChanged={(event) => { this.signinInputChanged("signinPassword", event.target.value) }}
             />

          : !this.labosMode ?
            <UsersTemplate
              contract={this.state.contractInstance}
              analyses={this.state.analyses.reverse()}
              balance={this.state.balance}
              accountAddress={this.state.accountAddress}
              reloadAccountInfo={this.loadAccountInfo.bind(this)}
            />
            :
            <LabosTemplate
              analyses={this.state.analyses.reverse()}
              balance={this.state.balance}
              contract={this.state.contractInstance}
              accountAddress={this.state.accountAddress}
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
