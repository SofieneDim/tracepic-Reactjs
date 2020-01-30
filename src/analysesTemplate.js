import React from 'react'
import Web3 from 'web3';

const analysesTemplate = props => {

    return (
        <div id="analyses-template-panel" style={{ border: '3px solid ' + props.color }}>
            <div id="analyses-template-header" style={{ backgroundColor: props.color }}>
                <strong><span id="analyse-panel-title">Reference: {props.analyse.analyseReference}</span></strong>
            </div>
            {props.laboMode ?
                <div style={{ padding: '10px' }}>
                    <strong>Value:</strong> <span>{props.analyse.value}</span> <br />
                    <strong>Description:</strong> <span>{props.analyse.description}</span><br />
                    <strong>Price:</strong> <span>{Web3.utils.fromWei(props.analyse.price, "ether")} (ETH) </span><br />
                    <strong>Date:</strong> <span>{props.analyse.date}</span><br />
                </div>
                : <div style={{ padding: '10px' }}>
                    <strong>Value:</strong> <span>******************</span> <br />
                    <strong>Description:</strong> <span>******************</span><br />
                    <strong>Price:</strong> <span>{Web3.utils.fromWei(props.analyse.price, "ether")} (ETH) </span><br />
                    <strong>Date:</strong> <span>{props.analyse.date}</span><br />
                </div>
            }
            <div id="analyses-template-footer" style={{ backgroundColor: props.color }}>
                {!props.laboMode ?
                    <button type="button" className="btn btn-primary btn-success" onClick={props.buyAnalyse}>Buy</button>
                    : null
                }
                <strong><span id="analyse-note">{props.note}</span></strong>
                <strong><span id="analyse-state">{props.state}</span></strong>
            </div>
        </div>
    )
}

export default analysesTemplate;