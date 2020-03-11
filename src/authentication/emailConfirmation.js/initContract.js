import React, { Component } from 'react'
import Confirm from './confirmEmail'
import { TRACEPIC_ABI, TRACEPIC_ADDRESS } from '../../contract_ABI_Address'
import Web3 from 'web3'

class Contract extends Component {

    state = {
        contractInstance: null,
        web3: null,
    }

    componentWillMount = async () => {
        await this.initContract()
    }

    async initContract() {
        const web3 = new Web3(Web3.givenProvider || "https://tracepic-backend.trimakus.com/geth")
        const contractInstance = await new web3.eth.Contract(TRACEPIC_ABI, TRACEPIC_ADDRESS)
        await this.setState({ contractInstance, web3 })
    }

    render = () => {
        return (
            <Confirm
                contractInstance={this.state.contractInstance}
                web3={this.state.web3}
                params={this.props.match.params}
            />
        )
    }
}

export default Contract;