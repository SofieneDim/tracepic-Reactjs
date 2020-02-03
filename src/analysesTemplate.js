import React, { Component } from 'react'
import Web3 from 'web3';

class AnalysesTemplate extends Component {

    constructor(props){
        super(props)
        this.state={
            showSecret: false
        }
    }

    render(){
        return (
            <div id="analyses-template-panel" style={{ border: '3px solid ' + this.props.color }}>
                <div id="analyses-template-header" style={{ backgroundColor: this.props.color }}>
                    <strong><span id="analyse-panel-title">Reference: {this.props.analyse.analyseReference}</span></strong>
                    {this.props.laboMode & this.props.analyse.secret != 0 ?
                        <div style={{ float: "right", cursor: "pointer" }}  onClick={() => this.setState({ showSecret: !this.state.showSecret})}>
                            {this.state.showSecret ?
                                <strong><span> {this.props.analyse.secret} </span></strong>
                                :
                                <strong><span> Show Secret </span></strong>
                            }
                        </div>
                        : null
                    }
                </div>
                {this.props.laboMode ?
                    <div style={{ padding: '10px' }}>
                        <strong>Value:</strong> <span>{this.props.analyse.value}</span> <br />
                        <strong>Description:</strong> <span>{this.props.analyse.description}</span><br />
                        <strong>Price:</strong> <span>{Web3.utils.fromWei(this.props.analyse.price, "ether")} (ETH) </span><br />
                        <strong>Date:</strong> <span>{this.props.analyse.date}</span><br />
                    </div>
                    : <div style={{ padding: '10px' }}>
                        <strong>Value:</strong> <span>******************</span> <br />
                        <strong>Description:</strong> <span>******************</span><br />
                        <strong>Price:</strong> <span>{Web3.utils.fromWei(this.props.analyse.price, "ether")} (ETH) </span><br />
                        <strong>Date:</strong> <span>{this.props.analyse.date}</span><br />
                    </div>
                }
                <div id="analyses-template-footer" style={{ backgroundColor: this.props.color }}>
                    {!this.props.laboMode && this.props.analyse.buyer == "0x0000000000000000000000000000000000000000" ?
                        <button type="button" className="btn btn-primary btn-success" onClick={this.props.buyAnalyse}>Buy</button>
                        : null
                    }
                    <strong><span id="analyse-note">{this.props.note}</span></strong>
                    <strong><span id="analyse-state">{this.props.state}</span></strong>
                </div>
            </div>
        )
    }
}

export default AnalysesTemplate;