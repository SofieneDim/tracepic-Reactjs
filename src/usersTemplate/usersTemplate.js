import React, { Component } from 'react'
import './usersTemplate.css'

import NavigationBar from './usersNavigationBar'
import AnalysesTemplate from '../analysesTemplate'

class UsersTemplate extends Component {

    constructor(props) {
        super(props)
        this.state = {
            analyses: this.props.analyses,
            analysesForSale: [],
            selfBougthAnalyses: [],
            analysesLeftIndex: [],
            analysesRightIndex: [],
            showAnalysesForSale: true
        }
        this.loadAnalyses()
    }

    async loadAnalyses() {
        const analyses = []
        const analysesForSale = []

        const analysesIds = await this.props.contract.methods.getAllAnalyses().call()
        for (let i = 1; i <= analysesIds.length; i++) {
            analyses.push(await this.props.contract.methods.analyses(i).call())
        }

        const analysesForSaleIds = await this.props.contract.methods.getAnalysesForSale().call()
        for (let i = 0; i < analysesForSaleIds.length; i++) {
            console.log('analysesForSaleIds[i]:', analysesForSaleIds[i])
            analysesForSale.push(await this.props.contract.methods.analyses(analysesForSaleIds[i]).call())
        }

        this.setState({ analyses })
        this.setState({ analysesForSale })

        this.sortAnalyses()
    }

    sortAnalyses() {
        const analyses = this.state.analyses
        const selfBougthAnalyses = []
        let analysesLeftIndex = []
        let analysesRightIndex = []

        for (let i = 0; i < this.state.analysesForSale.length; i++) {
            if (i % 2 === 0) {
                analysesLeftIndex.push(this.state.analysesForSale[i])
            } else {
                analysesRightIndex.push(this.state.analysesForSale[i])
            }
        }

        for (let i = 0; i < analyses.length; i++) {

            if (analyses[i][2] == this.props.accountAddress) {
                selfBougthAnalyses.push(analyses[i])
            }
        }

        this.setState({ selfBougthAnalyses, analysesRightIndex, analysesLeftIndex })
    }

    async buyAnalyse(_id, _price) {
        console.log('_id:', _id)
        const transactionReceipt = await this.props.contract.methods
            .buyAnalyse(_id).send({
                from: this.props.accountAddress,
                value: _price
            })
        console.log('transactionReceipt:', transactionReceipt)

        this.loadAnalyses()
        this.setState({ showAnalysesForSale: false })
        this.props.reloadAccountInfo()
        this.showBoughtAnalyseResult(_id)
    }

    async showBoughtAnalyseResult(_id) {
        //console.log(await this.props.contract.methods.analyses(_id).call())
    }

    analysesSortDisplay(forSale) {
        this.setState({ showAnalysesForSale: forSale })
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
                        description={analyse.description}
                        buyAnalyse={() => this.buyAnalyse(analyse.id, analyse.price)}
                    />
                    return null
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
                        description={analyse.description}
                        buyAnalyse={() => this.buyAnalyse(analyse.id, analyse.price)}
                    />
                    return null
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
                        description={analyse.description}
                        buyAnalyse={() => this.buyAnalyse(analyse.id, analyse.price)}
                    />
                    return null
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
                        <button id="buy-ether" ></button>
                    </div>
                    <div className="col-md-8">
                        <div className="row">
                            <div className="col-md-3">
                                <p id="account_name" style={{ textAlign: 'right' }} >name</p>
                            </div>
                            <div className="col-md-9">
                                <p id="account" style={{ textAlign: 'right' }} >{this.props.accountAddress}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <NavigationBar
                    forSale={() => this.analysesSortDisplay(true)}
                    selfBought={() => this.analysesSortDisplay(false)}
                />
                {this.state.showAnalysesForSale ?
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
            </div>
        )
    }
}

export default UsersTemplate;