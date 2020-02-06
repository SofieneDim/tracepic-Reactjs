import React, { Component } from 'react'
import './labosTemplate.css'

import NavigationBar from './labosNavigationBar'
import AnalysesTemplate from '../analysesTemplate';
import PostAnalyse from './postAnalyseTemplate';
import Web3 from 'web3';
import ipfs from '../ipfs/ipfsConfig';
import { TRACEPIC_ADDRESS } from '../contract_ABI_Address';

class labosTemplate extends Component {

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
            postAnalyseLoading: false
        }
    }

    componentDidMount = async () => {

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
        this.setState({ secretCode: 0 })
        this.setState({ showAnalyse: false })
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
        console.log('this.state.isPrivate 2:', this.state.isPrivate)
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
            this.setState({ analyseValue: fileLink, postSubmitDisable: false })
            if (error) { return console.error(error) }
        })
    }

    render() {

        const analyses = (
            <div>
                {
                    this.props.analyses.map((analyse) => {
                        return this.state.showSelfPosted ?
                            <AnalysesTemplate
                                analyse={analyse}
                                key={analyse.id}
                                laboMode={true}
                                color={'black'}
                                note={
                                    analyse.buyer !== "0x0000000000000000000000000000000000000000"
                                        ? "Sold by: " + analyse.buyer
                                        : "Not sold yet"
                                }
                                state={
                                    analyse.secret !== "0"
                                        ? "Private analyse"
                                        : "Public analyse"
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
                                            ? "Sold by: " + analyse.buyer
                                            : "Not sold yet"
                                    }
                                    state={
                                        analyse.secret !== "0"
                                            ? "Private analyse"
                                            : "Public analyse"
                                    }
                                    description={analyse.description}
                                />
                                : null
                    })
                }
            </div >
        )

        return (
            <div >
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
                    postAnalyse={() => {this.getAnalyseValue(); this.setState({ analyseValue: '' })}}
                    postedAnalyses={() => this.setState({ showAnalyse: true, showSelfPosted: true, searchAnalyseResult: null })}
                    boughtAnalyses={() => this.setState({ showAnalyse: true, showSelfPosted: false, searchAnalyseResult: null })}
                    searchAnalyse={this.searchAnalyse.bind(this)}
                    analyseSearchChange={(event) => this.setState({ analyseSearchReference: event.target.value })}
                />
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