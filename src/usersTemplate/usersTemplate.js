import React, { Component } from 'react'
import './usersTemplate.css'

import NavigationBar from './usersNavigationBar'
import AnalysesTemplate from '../analysesTemplate'

class UsersTemplate extends Component {

    constructor(props){
        super(props)
        this.state={
            analyses: this.props.analyses
        }
    }

    componentWillMount(){
        this.loadAnalyses()
    }

    async loadAnalyses() {
      const analysesIds = await this.props.contract.methods.getAllAnalyses().call()
      const analyses = []
      for (let i = 1; i <= analysesIds.length; i++) {
        analyses.push(await this.props.contract.methods.analyses(i).call())
      }
      console.log('analyses:', analyses)
      this.setState({ analyses })
    }

    async buyAnalyse(_id, _price) {
        const transactionReceipt = await this.props.contract.methods
            .buyAnalyse(_id).send({
                from: this.props.accountAddress,
                value: _price
            })
        this.props.reloadAccountInfo()
        
        this.loadAnalyses()
        
        console.log('transactionReceipt:', transactionReceipt)
    }

    render() {
        let analysesLeft = null
        let analysesRight = null
        
        analysesLeft = (
            <div>
                {this.state.analyses.map((analyse, index) => {
                    if (index % 2 === 0 && analyse[2] == '0x0000000000000000000000000000000000000000') {
                        return <AnalysesTemplate
                            value={analyse.value}
                            price={analyse.price}
                            date={analyse.date}
                            key={analyse.id}
                            laboMode={false}
                            color={'rgba(67, 64, 241, 0.911)'}
                            description={analyse.description}
                            buyAnalyse={() => this.buyAnalyse(analyse.id, analyse.price)}
                        />
                    }
                    return null
                })}
            </div>
        )
        analysesRight = (
            <div>
                {this.state.analyses.map((analyse, index) => {
                    if (index % 2 !== 0 && analyse[2] == '0x0000000000000000000000000000000000000000') {
                        return <AnalysesTemplate
                            value={analyse.value}
                            price={analyse.price}
                            date={analyse.date}
                            key={analyse.id}
                            laboMode={false}
                            color={"rgba(67, 64, 241, 0.911)"}
                            description={analyse.description}
                            buyAnalyse={() => this.buyAnalyse(analyse.id, analyse.price)}
                        />
                    }
                    return null
                })}
            </div>
        )

        return (
            <div>
                <div className="jumbotron" id="users-jumbotron"></div>
                <div className="row">
                    <div className="col-md-3">
                        <p id="accountBalance" >{this.props.balance} ETH</p>
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
                <NavigationBar />
                <div className="row" style={{ marginTop: '30px' }}>
                    <div className="col-md-6" style={{ padding: '0px' }}>
                        {analysesLeft}
                    </div>
                    <div className="col-md-6" style={{ padding: '0px' }}>
                        {analysesRight}
                    </div>
                </div>
            </div>
        )
    }
}

export default UsersTemplate;