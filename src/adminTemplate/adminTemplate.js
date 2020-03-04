import React, { Component } from 'react'
import './adminTemplate.css'
import RequestTemplate from './requestTemplate'
import { TRACEPIC_ADDRESS } from '../contract_ABI_Address'
import AdminNavigationBar from './adminNavBar'

class AdminTemplate extends Component {

    state = {
        allRequests: [],
        loading: false
    }

    async componentDidMount() {
        this.getAllSignupRequests()
    }

    getAllSignupRequests = async () => {
        let allRequestsIds = null
        try {
            allRequestsIds = await this.props.contractInstance.methods.getSignupRequestCounter().call()
        } catch (error) {
            return console.error(error);
        }
        const allRequests = []
        for (let i = 1; i <= allRequestsIds; i++) {
            let request = await this.props.contractInstance.methods.signupRequests(i).call()
            allRequests.push(request)
        }
        await this.setState({ allRequests })
        this.sortAllSignupRequests()
    }

    sortAllSignupRequests = () => {
        const allRequestsLeft = []
        const allRequestsRight = []
        this.state.allRequests.map((request, i) => {
            i % 2 == 0 ?
                allRequestsLeft.push(
                    <RequestTemplate
                        key={request.id}
                        request={request}
                        refuse={() => this.refuseRequest(request.id)}
                        approve={this.approveRequest.bind(this, request.id)}
                        loading={this.state.loading}
                    />
                )
                :
                allRequestsRight.push(
                    <RequestTemplate
                        key={request.id}
                        request={request}
                        refuse={() => this.refuseRequest(request.id)}
                        approve={this.approveRequest.bind(this, request.id)}
                        loading={this.state.loading}
                    />
                )
        })
        this.setState({ allRequestsLeft, allRequestsRight })
    }

    approveRequest = async (id) => {
        //this.setState({ loading: true })
        const encoded_tx = this.props.contractInstance.methods.approveRequest(id).encodeABI();
        var rawTransaction = {
            "from": this.props.accountAddress,
            "data": encoded_tx,
            "to": TRACEPIC_ADDRESS,
            "gas": 500000
        }
        let signedTransaction = null
        let transactionReceipt = null
        try {
            signedTransaction = await this.props.web3.eth.accounts.signTransaction(rawTransaction, this.props.privateKey)
            transactionReceipt = await this.props.web3.eth.sendSignedTransaction(signedTransaction.rawTransaction)
        } catch (error) {
            this.setState({ loading: false })
            return console.error(error)
        }
        this.setState({ loading: false })
        console.log('receipt:', transactionReceipt)
        await this.getAllSignupRequests()
        this.showApprovedRequest()
    }

    refuseRequest = async (id) => {
        //this.setState({ loading: true })
        const encoded_tx = this.props.contractInstance.methods.refuseRequest(id).encodeABI();
        var rawTransaction = {
            "from": this.props.accountAddress,
            "data": encoded_tx,
            "to": TRACEPIC_ADDRESS,
            "gas": 500000
        }
        let signedTransaction = null
        let transactionReceipt = null
        try {
            signedTransaction = await this.props.web3.eth.accounts.signTransaction(rawTransaction, this.props.privateKey)
            transactionReceipt = await this.props.web3.eth.sendSignedTransaction(signedTransaction.rawTransaction)
        } catch (error) {
            this.setState({ loading: false })
            return console.error(error)
        }
        this.setState({ loading: false })
        console.log('receipt:', transactionReceipt)
        await this.getAllSignupRequests()
        this.showRefusedRequest()
    }

    showApprovedRequest = () => {
        const allRequestsLeft = []
        const allRequestsRight = []
        let sort = false
        this.state.allRequests.map((request, i) => {
            if (request.approved) {
                if (sort) {
                    allRequestsLeft.push(
                        <RequestTemplate
                            key={request.id}
                            request={request}
                            refuse={() => this.refuseRequest(request.id)}
                            approve={this.approveRequest.bind(this, request.id)}
                            loading={this.state.loading}
                        />
                    )
                    sort = !sort
                } else {
                    allRequestsRight.push(
                        <RequestTemplate
                            key={request.id}
                            request={request}
                            refuse={() => this.refuseRequest(request.id)}
                            approve={this.approveRequest.bind(this, request.id)}
                            loading={this.state.loading}
                        />
                    )
                    sort = !sort
                }
            }
            this.setState({ allRequestsLeft, allRequestsRight })
        })
    }

    showRefusedRequest = () => {
        const allRequestsLeft = []
        const allRequestsRight = []
        let sort = false
        this.state.allRequests.map((request, i) => {
            if (!request.pending && !request.approved) {
                if (sort) {
                    allRequestsLeft.push(
                        <RequestTemplate
                            key={request.id}
                            request={request}
                            refuse={() => this.refuseRequest(request.id)}
                            approve={this.approveRequest.bind(this, request.id)}
                            loading={this.state.loading}
                        />
                    )
                    sort = !sort
                } else {
                    allRequestsRight.push(
                        <RequestTemplate
                            key={request.id}
                            request={request}
                            refuse={() => this.refuseRequest(request.id)}
                            approve={this.approveRequest.bind(this, request.id)}
                            loading={this.state.loading}
                        />
                    )
                    sort = !sort
                }
            }
            this.setState({ allRequestsLeft, allRequestsRight })
        })
    }

    showPendingRequest = () => {
        const allRequestsLeft = []
        const allRequestsRight = []
        let sort = false
        this.state.allRequests.map((request, i) => {
            if (request.pending) {
                if (sort) {
                    allRequestsLeft.push(
                        <RequestTemplate
                            key={request.id}
                            request={request}
                            refuse={() => this.refuseRequest(request.id)}
                            approve={this.approveRequest.bind(this, request.id)}
                            loading={this.state.loading}
                        />
                    )
                } else {
                    allRequestsRight.push(
                        <RequestTemplate
                            key={request.id}
                            request={request}
                            refuse={() => this.refuseRequest(request.id)}
                            approve={this.approveRequest.bind(this, request.id)}
                            loading={this.state.loading}
                        />
                    )
                }
            }
            this.setState({ allRequestsLeft, allRequestsRight })
        })
    }

    searchRequest = async () => {
        let request = await this.props.contractInstance.methods.signupRequests(this.state.requestSearch).call()
        request.id == 0 ? console.log('request not found') :
            console.log('request:', request)
    }

    render() {
        return (
            <div className="container">
                <div className="jumbotron" id="admin-jumbotron"></div>
                <AdminNavigationBar
                    showApprovedRequest={() => this.showApprovedRequest()}
                    showAllRequests={() => this.sortAllSignupRequests()}
                    showRefusedRequest={() => this.showRefusedRequest()}
                    showPendingRequest={() => this.showPendingRequest()}
                    searchRequest={this.searchRequest}
                    requestSearchChange={(e) => this.setState({ requestSearch: e.target.value })}
                />
                <div className="row" id="request-placeholder" style={{ marginTop: '20px' }}>
                    <div className="col-md-6">
                        {this.state.allRequestsLeft}
                    </div>
                    <div className="col-md-6">
                        {this.state.allRequestsRight}
                    </div>
                </div>
            </div>
        )
    }
}

export default AdminTemplate;