import React, { Component } from 'react'
import './labosTemplate.css'

import NavigationBar from './labosNavigationBar'
import AnalysesTemplate from '../analysesTemplate';
import PostAnalyse from './postAnalyseTemplate';
import Web3 from 'web3';

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
            secretCode: ''
        }
    }

    async postAnalyse(event) {
        event.preventDefault()
        const _reference = this.state.reference
        const _price = Web3.utils.toWei(this.state.analysePrice, "ether")
        const _description = this.state.analyseDescription
        const _value = this.state.analyseValue
        const _date = new Date().getDate() + "-" + (new Date().getMonth() + 1) + "-" + new Date().getFullYear() +
            " " + new Date().getHours() + ":" + new Date().getMinutes() + ":" + new Date().getSeconds()

        try {
            const trasactionReceipt = await this.props.contract.methods
                .sellAnalyse(_reference, _value, _date, _description, _price, 0)
                .send({ from: '0xBE62aD6420E3CB8493812Cd516Fdc06fa738F0f4', gas: 20000000 })
            console.log('trasactionReceipt:', trasactionReceipt)
            this.setState({ showAnalyse: true })
            this.props.reloadAnalyses()
        } catch (error) {
            console.error('error:', error)
        }
    }

    getAnalyseValue() {
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
                        this.setState({ analyseValue: xhttp.response.value })
                    } else {
                        // setTimeout(() => {this.getAnalyseValue()}, 2000)
                    }
                } else {
                    // setTimeout(() => {this.getAnalyseValue()}, 2000)
                }
            } else {
                console.log('xhttp.response.value:', xhttp.response)
                // setTimeout(() => {this.getAnalyseValue()}, 2000)
            }
        }.bind(this)
    }

    async checkboxHandler(){
        this.setState({ isPrivate: !this.state.isPrivate})
        setTimeout(() => {this.manageSecretCode()}, 200)
    }

    async manageSecretCode(){
        console.log('this.state.isPrivate:', this.state.isPrivate)
        
        if(this.state.isPrivate){
            let secretCode = parseInt(Math.random() * 10000);
            let _validSecret = await this.props.contract.methods.secretValid(secretCode).call();
            while (secretCode < 1000 || secretCode > 9999 || !_validSecret){
                secretCode = parseInt(Math.random() * 10000);
                _validSecret = await this.props.contract.methods.secretValid(secretCode).call();
            }
            this.setState({ secretCode })
        } else {
            this.setState({ secretCode: '' })
        }
    }

    cancelPostHandler(){
        console.log('this.state.isPrivate 2:', this.state.isPrivate)
    }

    render() {

        const analyses = (
            <div>
                {
                    this.props.analyses.map((analyse) => {
                        return <AnalysesTemplate
                            analyse={analyse}
                            key={analyse.id}
                            laboMode={true}
                            color={'black'}
                            description={analyse.description}
                        />
                    })
                }
            </div>
        )

        return (
            <div >
                <div className="jumbotron" id="labos-jumbotron"></div>
                <NavigationBar
                    postAnalyse={this.getAnalyseValue.bind(this)}
                    postedAnalyses={() => this.setState({ showAnalyse: true, showSelfPosted: true })}
                    boughtAnalyses={() => this.setState({ showAnalyse: true, showSelfPosted: false })}
                />
                {this.state.showAnalyse ?
                    this.state.showSelfPosted ?
                        <div className="row" style={{ marginTop: '30px' }}>
                            <div className="col-md-12" style={{ padding: '0px' }}>
                                {analyses}
                            </div>
                        </div>
                        : null
                    :
                    <div className="row" style={{ marginTop: '30px' }}>
                        <div class="col-md-2"></div>
                        <div className="col-md-8" style={{ padding: '0px' }}>
                            <PostAnalyse
                                submit={this.postAnalyse.bind(this)}
                                cancel={this.cancelPostHandler.bind(this)}
                                secretCode={ this.state.secretCode }
                                analyseValue={this.state.analyseValue}
                                checkboxSwiched={() => this.checkboxHandler()}
                                referenceChanged={(event) => this.setState({ reference: event.target.value })}
                                priceChanged={(event) => this.setState({ analysePrice: event.target.value })}
                                descriptionChanged={(event) => this.setState({ analyseDescription: event.target.value })}
                            />
                        </div>
                        <div class="col-md-2"></div>
                    </div>
                }
            </div >
        )
    }
}

export default labosTemplate;