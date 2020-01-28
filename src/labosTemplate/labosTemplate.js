import React, { Component } from 'react'
import './labosTemplate.css'

import NavigationBar from './labosNavigationBar'
import AnalysesTemplate from '../analysesTemplate';
import PostAnalyse from './postAnalyseTemplate';

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
            analyseValue: ''
        }
    }
    
    async postAnalyse(event) {
        event.preventDefault()
        console.log(this.props.contract)
        const _reference = this.state.reference
        const _price = this.state.analysePrice
        const _description = this.state.analyseDescription
        const _value = this.state.analyseValue
        const _date = new Date().getDate() + "-" + (new Date().getMonth() + 1) + "-" + new Date().getFullYear() +
            " " + new Date().getHours() + ":" + new Date().getMinutes() + ":" + new Date().getSeconds()

        console.log('_reference:')
        try {
            console.log(await this.props.contract.methods.sellAnalyse(_reference, _value, _date, _description, _price, 0).send({
                from: this.props.accountAddress
            }))
            const trasactionReceipt = await this.props.contract.methods
                .sellAnalyse(_reference, _value, _date, _description, _price, 0).send({
                    from: this.props.accountAddress
                })
            console.log(trasactionReceipt)
        } catch (error) {
            console.error('error:', error)
        }
    }

    getAnalyseValue() {
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
                        this.showPostAnalyseTemplate()
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

    showPostAnalyseTemplate() {
        this.setState({ showAnalyse: false })
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
                                analyseValue={this.state.analyseValue}
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