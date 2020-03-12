import React, { Component } from 'react'
import './labosTemplate.css'

import NavigationBar from './labosNavigationBar'
import AnalysesTemplate from '../analysesTemplate';
import PostAnalyse from './postAnalyseTemplate';
import Web3 from 'web3';
import ipfs from '../ipfs/ipfsConfig';
import { TRACEPIC_ADDRESS } from '../contract_ABI_Address';

import languagesContext from '../context/languages-context';

class labosTemplate extends Component {

    static contextType = languagesContext

    constructor(props) {
        super(props)
        this.state = {
            showAnalyse: true,
            showSelfPosted: true,
            reference: '',
            analysePrice: '',
            analyseValue: '',
            analyseDescription: '',
            analyseValue: '',
            isPrivate: false,
            secretCode: 0,
            postSubmitDisable: true,
            postAnalyseLoading: false,
            showSendEtherPlace: false,
            sendEthTo: "",
            sendEthValue: "",
            sendEthComplete: false,
            sendEthLoad: false,
            ipfsUploadLoad: false,
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        const propsChanged = this.props.analyses !== nextProps.analyses || this.props.balance !== nextProps.balance
        const stateChanged = this.state !== nextState
        return propsChanged || stateChanged
    }

    async postAnalyse(event) {
        event.preventDefault()
        this.setState({ postAnalyseLoading: true, postSubmitDisable: true })
        const _reference = this.state.reference
        const _price = Web3.utils.toWei(this.state.analysePrice, "ether")
        const _description = this.state.analyseDescription
        const _value = this.state.analyseValue
        const _secretCode = this.state.secretCode
        const _date = new Date().getDate() + "-" + (new Date().getMonth() + 1) + "-" + new Date().getFullYear() +
            " " + new Date().getHours() + ":" + new Date().getMinutes() + ":" + new Date().getSeconds()
        const encoded_tx = this.props.contractInstance.methods
            .sellAnalyse(_reference, _value, _date, _description, _price, _secretCode).encodeABI();
        var rawTransaction = {
            "from": this.props.accountAddress,
            "data": encoded_tx,
            "to": TRACEPIC_ADDRESS,
            "gas": 500000
        }

        try {
            this.props.web3.eth.accounts.signTransaction(rawTransaction, this.props.privateKey)
                .then(signedTx => this.props.web3.eth.sendSignedTransaction(signedTx.rawTransaction))
                .then(receipt => {
                    console.log('receipt:', receipt)
                    this.props.reloadAnalyses()
                    this.setState({ postAnalyseLoading: false, showAnalyse: true, showSelfPosted: true })
                })
                .catch(err => {
                    console.error(err)
                })
        } catch (error) {
            console.log(error)
        }
    }

    getAnalyseValue() {
        this.setState({ secretCode: 0, showAnalyse: false })
        var url = 'http://localhost:8081/';
        var xhttp = new XMLHttpRequest();
        xhttp.responseType = 'json';
        xhttp.open('get', url, true);
        xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        xhttp.send();
        xhttp.onreadystatechange = function () {
            if (xhttp.status == 200) {
                if (xhttp.response !== null) {
                    if (xhttp.response.state == true) {
                        this.setState({ analyseValue: xhttp.response.value, postSubmitDisable: false })
                    } else {
                        // setTimeout(() => {this.getAnalyseValue()}, 2000)
                    }
                } else {
                    // setTimeout(() => {this.getAnalyseValue()}, 2000)
                }
            } else {
                // setTimeout(() => {this.getAnalyseValue()}, 2000)
            }
            this.setState({ isPrivate: false })
        }.bind(this)
    }

    async checkboxHandler() {
        this.setState({ isPrivate: !this.state.isPrivate })
        setTimeout(() => { this.manageSecretCode() }, 200)
    }

    async manageSecretCode() {
        if (this.state.isPrivate) {
            let secretCode = parseInt(Math.random() * 10000);
            let _validSecret = await this.props.contractInstance.methods.secretValid(secretCode).call();
            while (secretCode < 1000 || secretCode > 9999 || !_validSecret) {
                secretCode = parseInt(Math.random() * 10000);
                _validSecret = await this.props.contractInstance.methods.secretValid(secretCode).call();
            }
            this.setState({ secretCode })
        } else {
            this.setState({ secretCode: 0 })
        }
    }

    cancelPostHandler() {
        this.setState({ showAnalyse: true, showSelfPosted: true, searchAnalyseResult: null })
    }

    async searchAnalyse(event) {
        event.preventDefault()
        const analyseId = await this.props.contractInstance.methods
            .getAnalyseByReference(this.state.analyseSearchReference).call()
        if (analyseId == 0) { return console.log('analyse not found!') }
        const analyse = await this.props.contractInstance.methods.analyses(analyseId).call()
        const searchAnalyseResult = (
            <div>
                <AnalysesTemplate
                    analyse={analyse}
                    laboMode={true}
                    color={'green'}
                />
            </div>
        )
        this.setState({ searchAnalyseResult })
    }

    captureFileHandler = async (event) => {
        event.preventDefault()
        console.log('begin')
        this.setState({ ipfsUploadLoad: true })
        const file = event.target.files[0]
        const reader = new window.FileReader()
        reader.readAsArrayBuffer(file)
        reader.onloadend = async () => {
            await this.uploadFileToIPFS(Buffer(reader.result))
        }
    }

    async uploadFileToIPFS(fileBuffer) {
        await ipfs.add(fileBuffer, (error, ipfsHash) => {
            const fileLink = "https://ipfs.infura.io/ipfs/" + ipfsHash[0].hash
            console.log('finish')
            this.setState({ analyseValue: fileLink, postSubmitDisable: false, ipfsUploadLoad: false })
            if (error) {
                this.setState({ ipfsUploadLoad: false })
                return console.error(error)
            }
        })
    }

    sendEtherHandler = async (event) => {
        event.preventDefault()
        this.setState({ sendEthLoad: true })
        const _value = Web3.utils.toWei(this.state.sendEthValue, "ether")
        var rawTransaction = {
            from: this.props.accountAddress,
            to: this.state.sendEthTo,
            value: _value,
            gas: 500000
        }
        await this.props.web3.eth.accounts.signTransaction(rawTransaction, this.props.privateKey)
            .then(signedTx => this.props.web3.eth.sendSignedTransaction(signedTx.rawTransaction))
            .then(async receipt => {
                let clientBalance = await this.props.web3.eth.getBalance(this.state.sendEthTo)
                clientBalance = this.props.web3.utils.fromWei(clientBalance, "ether") + " ETH"
                const labosBalance = await this.props.web3.eth.getBalance(this.props.accountAddress)
                this.props.setBalance(this.props.web3.utils.fromWei(labosBalance, "ether"))
                this.setState({ clientBalance, sendEthComplete: true, sendEthLoad: false })
            })
            .catch(err => {
                this.setState({ sendEthLoad: false })
                return console.error(err)
            });

    }

    render() {
        const { t } = this.context
        const analyses = (
            <div id="analysis_placeholder">
                {
                    this.props.analyses.map(analyse => {
                        return this.state.showSelfPosted ?
                            <AnalysesTemplate
                                analyse={analyse}
                                key={analyse.id}
                                laboMode={true}
                                color={'black'}
                                note={
                                    analyse.buyer !== "0x0000000000000000000000000000000000000000"
                                        ? t('soldBy') + ": " + analyse.buyer
                                        : t('notSoldYet')
                                }
                                state={
                                    analyse.secret !== "0"
                                        ? t('privateAnalysis')
                                        : t('publicAnalysis')
                                }
                                description={analyse.description}
                            />
                            : analyse.buyer !== "0x0000000000000000000000000000000000000000" ?
                                <AnalysesTemplate
                                    analyse={analyse}
                                    key={analyse.id}
                                    laboMode={true}
                                    color={'grey'}
                                    note={
                                        analyse.buyer !== "0x0000000000000000000000000000000000000000"
                                            ? t('soldBy') + ": " + analyse.buyer
                                            : t('notSoldYet')
                                    }
                                    state={
                                        analyse.secret !== "0"
                                            ? t('privateAnalysis')
                                            : t('publicAnalysis')
                                    }
                                    description={analyse.description}
                                />
                                : null
                    })
                }
            </div >
        )

        return (
            <div>
                <div className="jumbotron" id="labos-jumbotron"></div>
                <div className="row">
                    <div className="col-md-3">
                        <p id="accountBalance" >{Number(this.props.balance).toFixed(2)} ETH</p>
                    </div>
                    <div className="col-md-4">
                        <p id="account_name" style={{ textAlign: 'right' }} >{this.props.accountName}</p>
                    </div>
                    <div className="col-md-5">
                        <p id="account" style={{ textAlign: 'right' }} >{this.props.accountAddress}</p>
                    </div>
                </div>
                <NavigationBar
                    sendEther={() => this.setState({ showSendEtherPlace: true, sendEthComplete: false })}
                    postAnalyse={() => { this.getAnalyseValue(); this.setState({ analyseValue: '', showSendEtherPlace: false, sendEthComplete: false }) }}
                    postedAnalyses={() => this.setState({ showAnalyse: true, showSelfPosted: true, searchAnalyseResult: null, showSendEtherPlace: false, sendEthComplete: false })}
                    boughtAnalyses={() => this.setState({ showAnalyse: true, showSelfPosted: false, searchAnalyseResult: null, showSendEtherPlace: false, sendEthComplete: false })}
                    analyseSearchChange={(event) => this.setState({ analyseSearchReference: event.target.value })}
                    searchAnalyse={this.searchAnalyse.bind(this)}
                />
                {this.state.showSendEtherPlace ?
                    <div id="sendETH" >
                        {
                            !this.state.sendEthComplete ?
                                <form onSubmit={this.sendEtherHandler}>
                                    <div className="row">
                                        <div className="col-md-2"></div>
                                        <div className="col-md-8">
                                            <div className="col-md-12 centered" style={{ marginTop: '10px' }}>
                                                <b><label style={{ marginRight: '10px' }}>
                                                    {t('To')} :
                                                </label></b>
                                            </div>
                                            <div className="col-md-12" style={{ margin: '0px' }}>
                                                <input
                                                    className="form-control"
                                                    type="text"
                                                    onChange={(e) => this.setState({ sendEthTo: e.target.value })}
                                                    required
                                                ></input>
                                            </div>
                                            <div className="col-md-12 centered" style={{ marginTop: '10px' }}>
                                                <b><label style={{ marginRight: '10px' }}>
                                                    {t('value')} :
                                                </label></b>
                                            </div>
                                            <div className="col-md-12 centered" style={{ margin: '0px' }}>
                                                <input type="number" onChange={(e) => this.setState({ sendEthValue: e.target.value })} required></input>
                                            </div>
                                            {this.state.sendEthLoad ?
                                                <div className="col-md-12 centered" style={{ margin: '10px' }}>
                                                    <div className="loader2"></div>
                                                </div>
                                                : null
                                            }
                                            <div className="col-md-12 centered" style={{ margin: '10px' }}>
                                                <button
                                                    className="btn btn-info"
                                                    type="submit"
                                                >
                                                    {t('Send')}
                                                </button>
                                            </div>
                                        </div>
                                        <div className="col-md-2"></div>
                                    </div>
                                </form>
                                :
                                <div className="row">
                                    <div className="col-md-12 centered">
                                        <h2 style={{ color: 'green', margin: '20px' }}>
                                            {t('sendEthComplete')}
                                        </h2>
                                    </div>
                                    <div className="col-md-12 centered">
                                        <h4 style={{ color: 'green' }}>
                                            {this.state.sendEthTo}
                                        </h4>
                                    </div>
                                    <div className="col-md-12 centered">
                                        <h3>{t('clientBalance') + " " + this.state.clientBalance}</h3>
                                    </div>
                                </div>
                        }
                    </div>
                    : null
                }
                {this.state.searchAnalyseResult}
                {this.state.showAnalyse ?
                    this.state.showSelfPosted ?
                        <div className="row aa" style={{ marginTop: '30px' }}>
                            <div className="col-md-12" style={{ padding: '0px' }}>
                                {analyses}
                            </div>
                        </div>
                        :
                        <div className="row bb" style={{ marginTop: '30px' }}>
                            <div className="col-md-12" style={{ padding: '0px' }}>
                                {analyses}
                            </div>
                        </div>
                    :
                    <div className="row" style={{ marginTop: '30px' }}>
                        <div className="col-md-2"></div>
                        <div className="col-md-8" style={{ padding: '0px' }}>
                            {
                                this.state.postAnalyseLoading ?
                                    <div className="centered" style={{ margin: "20px" }}>
                                        <div className="loader"></div>
                                    </div>
                                    : null
                            }
                            <PostAnalyse
                                load={this.state.ipfsUploadLoad}
                                submit={this.postAnalyse.bind(this)}
                                cancel={this.cancelPostHandler.bind(this)}
                                secretCode={this.state.secretCode}
                                analyseValue={this.state.analyseValue}
                                checkboxSwiched={() => this.checkboxHandler()}
                                referenceChanged={(event) => this.setState({ reference: event.target.value })}
                                priceChanged={(event) => this.setState({ analysePrice: event.target.value })}
                                descriptionChanged={(event) => this.setState({ analyseDescription: event.target.value })}
                                captureFile={this.captureFileHandler}
                                submitDisable={this.state.postSubmitDisable}
                            />
                        </div>
                        <div className="col-md-2"></div>
                    </div>
                }
            </div >
        )
    }
}

export default labosTemplate;