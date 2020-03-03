import React, { Component } from 'react'
import './adminTemplate.css'

class AdminTemplate extends Component {

    async componentDidMount() {
        this.getAllSignupRequests()
    }

    getAllSignupRequests = async () => {
        console.log('this.props.contractInstance:', this.props.contractInstance)
        const requestsIds = await this.props.contractInstance.methods.getSignupRequestCounter().call()
        console.log('requestsIds:', requestsIds)
    }

    render() {
        return (
            <div className="container">
                <div className="jumbotron" id="admin-jumbotron"></div>
                <div id="request-placeholder"></div>
            </div>
        )
    }
}

export default AdminTemplate;