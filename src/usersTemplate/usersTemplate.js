import React, { Component } from 'react'
import './usersTemplate.css'

import NavigationBar from './usersNavigationBar'
import AnalysesTemplate from '../analysesTemplate'
import { TRACEPIC_ADDRESS } from '../contract_ABI_Address'

class UsersTemplate extends Component {

    constructor(props) {
        super(props)
        this.state = {
            analyses: this.props.analyses,
            analysesForSale: [],
            selfBougthAnalyses: [],
            analysesLeftIndex: [],
            analysesRightIndex: [],
            showAnalysesForSale: true,
            boughtAnalyseResult: null,
            privateAnalyseResult: null,
            showPrivateSearch: false,
            showBuyEther: false,
            secretCode: '',
            buyLoading: false
        }
        this.loadAnalyses()
    }

    async loadAnalyses() {
        const analysesIds = await this.props.contractInstance.methods.getAllAnalyses().call()
        const analysesForSale = []
        for (let i = 1; i <= analysesIds.length; i++) {

            const analyse = await this.props.contractInstance.methods.analyses(i).call()
            analysesForSale.push(analyse)

        }
        this.setState({ analysesForSale })
        this.sortAnalyses()
    }

    sortAnalyses() {
        const analyses = this.state.analysesForSale
        const selfBougthAnalyses = []
        let analysesLeftIndex = []
        let analysesRightIndex = []
        for (let i = 0; i < analyses.length; i++) {
            if (analyses[i].secret == 0 && analyses[i].buyer == 0x0) {
                if (i % 2 === 0) {
                    analysesLeftIndex.push(analyses[i])
                } else {
                    analysesRightIndex.push(analyses[i])
                }
            }
            if (analyses[i].buyer === this.props.accountAddress) {
                selfBougthAnalyses.push(analyses[i])
            }
        }
        this.setState({ selfBougthAnalyses: selfBougthAnalyses, analysesRightIndex: analysesRightIndex, analysesLeftIndex: analysesLeftIndex })
    }

    async buyAnalyse(_id, _price) {
        this.setState({ buyLoading: true })
        window.scrollTo(0, 0)
        const encoded_tx = this.props.contractInstance.methods.buyAnalyse(_id).encodeABI();
        var rawTransaction = {
            "from": this.props.accountAddress,
            "data": encoded_tx,
            "value": _price,
            "to": TRACEPIC_ADDRESS,
            "gas": 500000
        };
        this.props.web3.eth.accounts.signTransaction(rawTransaction, this.props.accountPrivateKey)
            .then(signedTx => this.props.web3.eth.sendSignedTransaction(signedTx.rawTransaction))
            .then(receipt => {
                this.showBoughtAnalyseResult(_id)
                this.loadAnalyses()
                this.props.reloadAccountInfo()
                this.setState({ privateAnalyseResult: null, buyLoading: false, showAnalysesForSale: false, searchAnalyseResult: null })
            })
            .catch(err => {
                console.error(err)
                this.setState({ buyLoading: false })
            });
    }

    async showBoughtAnalyseResult(_id) {
        const analyse = await this.props.contractInstance.methods.analyses(_id).call()
        const boughtAnalyseResult = (
            <div>
                <AnalysesTemplate
                    analyse={analyse}
                    laboMode={true}
                    color={'green'}
                />
            </div>
        )
        this.setState({ boughtAnalyseResult })
        window.scrollTo(0, 0)
    }

    async getPrivateAnalyseHandler(event) {
        event.preventDefault()
        let privateAnalyseResult = await this.props.contractInstance.methods.privateAnalyses(this.state.secretCode).call()
        privateAnalyseResult = await this.props.contractInstance.methods.analyses(privateAnalyseResult.id).call() // ***** .id rmv
        console.log('privateAnalyseResult:', privateAnalyseResult)
        if (privateAnalyseResult.id == 0) {
            console.log("analyse not found")
        } else {
            const searchAnalyseResult = (
                <div>
                    <AnalysesTemplate
                        analyse={privateAnalyseResult}
                        laboMode={false}
                        color={'rgba(67, 64, 241, 0.911)'}
                        buyAnalyse={() => this.buyAnalyse(privateAnalyseResult.id, privateAnalyseResult.price)}
                    />
                </div>
            )
            this.setState({ searchAnalyseResult })
        }
    }

    secretCodeHandler(event) {
        this.setState({ secretCode: event.target.value })
    }

    async searchAnalyse(event) {
        event.preventDefault()
        const analyseId = await this.props.contractInstance.methods
            .getAnalyseByReference(this.state.analyseSearchReference).call()
        if (analyseId == 0) { return console.log('analyse not found!') }
        const analyse = await this.props.contractInstance.methods.analyses(analyseId).call()
        if (analyse.secret != "0") { return console.log('this is a private analyse!') }
        const searchAnalyseResult = (
            <div>
                <AnalysesTemplate
                    analyse={analyse}
                    laboMode={false}
                    color={'rgba(67, 64, 241, 0.911)'}
                    buyAnalyse={() => this.buyAnalyse(analyse.id, analyse.price)}
                />
            </div>
        )
        this.setState({ searchAnalyseResult })
    }

    render() {

        const analysesLeftRow = (
            <div>
                {this.state.analysesLeftIndex.map((analyse) => {
                    return <AnalysesTemplate
                        analyse={analyse}
                        key={analyse.id}
                        laboMode={false}
                        color={'rgba(67, 64, 241, 0.911)'}
                        buyAnalyse={() => this.buyAnalyse(analyse.id, analyse.price)}
                    />
                })}
            </div>
        )
        const analysesRightRow = (
            <div>
                {this.state.analysesRightIndex.map((analyse) => {
                    return <AnalysesTemplate
                        analyse={analyse}
                        key={analyse.id}
                        laboMode={false}
                        color={"rgba(67, 64, 241, 0.911)"}
                        buyAnalyse={() => this.buyAnalyse(analyse.id, analyse.price)}
                    />
                })}
            </div>
        )
        const selfBougthAnalyses = (
            <div>
                {this.state.selfBougthAnalyses.map((analyse) => {
                    return <AnalysesTemplate
                        analyse={analyse}
                        key={analyse.id}
                        laboMode={true}
                        color={"rgb(13, 105, 244)"}
                        buyAnalyse={() => this.buyAnalyse(analyse.id, analyse.price)}
                    />
                })}
            </div>
        )

        return (
            <div>
                <div className="jumbotron" id="users-jumbotron"></div>
                <div className="row">
                    <div className="col-md-3">
                        <p id="accountBalance" >{Number(this.props.balance).toFixed(2)} ETH</p>
                    </div>
                    <div className="col-md-1">
                        <button
                            id="buy-ether"
                            onClick={() => this.setState({ showBuyEther: !this.state.showBuyEther })}
                        ></button>
                    </div>
                    <div className="col-md-8">
                        <div className="row">
                            <div className="col-md-3">
                                <p id="account_name" style={{ textAlign: 'right' }} >{this.props.accountName}</p>
                            </div>
                            <div className="col-md-9">
                                <p id="account" style={{ textAlign: 'right' }} >{this.props.accountAddress}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <NavigationBar
                    forSale={() => this.setState({ showAnalysesForSale: true, showPrivateSearch: false, searchAnalyseResult: null, boughtAnalyseResult: null, showBuyEther: false })}
                    selfBought={() => this.setState({ showAnalysesForSale: false, showPrivateSearch: false, searchAnalyseResult: null, boughtAnalyseResult: null, showBuyEther: false })}
                    privateAnalyse={() => this.setState({ showAnalysesForSale: false, showPrivateSearch: true, searchAnalyseResult: null, boughtAnalyseResult: null, showBuyEther: false })}
                    searchAnalyse={this.searchAnalyse.bind(this)}
                    analyseSearchChange={(event) => this.setState({ analyseSearchReference: event.target.value })}
                />
                {
                    this.state.buyLoading ?
                        <div className="centered" style={{marginTop: "20px"}}>
                            <div className="loader"></div>
                        </div>
                        : null
                }
                {
                    !this.state.showBuyEther ?
                        <div>
                            {this.state.boughtAnalyseResult}
                            {this.state.searchAnalyseResult}
                            {
                                this.state.showPrivateSearch ?
                                    <div className="row" style={{ marginTop: "50px" }}>
                                        <div className="col-md-12 centered">
                                            <p><strong>Type your analyse's secret code:</strong></p>
                                        </div>
                                        <div className="col-md-12 centered">
                                            <form onSubmit={this.getPrivateAnalyseHandler.bind(this)}>
                                                <input type="number" placeholder="Enter your code here..."
                                                    onChange={this.secretCodeHandler.bind(this)} required />
                                                <button type="submit">Submit</button>
                                            </form>
                                        </div>
                                    </div>
                                    :
                                    this.state.privateAnalyseResult
                                        ||
                                        this.state.showAnalysesForSale ?
                                        <div className="row" style={{ marginTop: '30px' }}>
                                            <div className="col-md-6" style={{ padding: '0px' }}>
                                                {analysesLeftRow}
                                            </div>
                                            <div className="col-md-6" style={{ padding: '0px' }}>
                                                {analysesRightRow}
                                            </div>
                                        </div>
                                        :
                                        <div className="row" style={{ marginTop: '30px' }}>
                                            <div className="col-md-12" style={{ padding: '0px' }}>
                                                {selfBougthAnalyses}
                                            </div>
                                        </div>
                            }
                        </div> : null
                }
            </div>
        )
    }
}

export default UsersTemplate;