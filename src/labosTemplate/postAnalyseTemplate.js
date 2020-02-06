import React, { Component } from 'react'

class postAnalyse extends Component {

    state = {
        fileValue: false
    }

    swichValueTypeHandler() {
        this.setState({ fileValue: !this.state.fileValue })
    }

    render() {
        return (
            <div>
                <form onSubmit={this.props.submit}>
                    <div className="row">
                        <div className="col-md-12" style={{ border: '5px solid black', marginBottom: '50px', backgroundColor: "lightgray" }}>
                            <div>
                                <div className="form-group" style={{ marginTop: '20px' }}>
                                    <label htmlFor="post-analyse-ref" className="centered">Reference:</label>
                                    <input type="text" className="form-control"
                                        id="post-analyse-ref"
                                        placeholder="Enter analyse's address"
                                        onChange={this.props.referenceChanged}
                                        required
                                    />
                                </div>
                                <div className="form-group" style={{ marginTop: '20px' }}>
                                    <label htmlFor="post-analyse-price" className="centered">Price (in ETH):</label>
                                    <input type="number" className="form-control"
                                        id="post-analyse-price"
                                        placeholder="Enter analyse's price"
                                        onChange={this.props.priceChanged}
                                        required
                                    />
                                </div>
                                <div className="centered">
                                    <label className="switch">
                                        <input type="checkbox" onClick={this.swichValueTypeHandler.bind(this)} />
                                        <span className="slider round" />
                                    </label>
                                </div>
                                {
                                    !this.state.fileValue ?
                                        <div className="form-group" style={{ marginTop: '20px' }}>
                                            <label htmlFor="post-analyse-price" className="centered">Value:</label>
                                            <label className="centered">{this.props.analyseValue}</label>
                                        </div>
                                        : <div className="form-group centered" style={{ marginTop: '20px' }}>
                                            <input type="file" onChange={this.props.captureFile} />
                                        </div>
                                }
                            </div>
                            <label className="centered">Description</label>
                            <textarea type="text" className="form-control vresize"
                                id="post-analyse-description"
                                placeholder="Describe your analyse"
                                onChange={this.props.descriptionChanged}
                                required></textarea>
                            <h3 style={{ marginTop: "10px" }}>
                                {this.props.secretCode == 0 ? "Make it private analyse" : "Make it public analyse"}
                            </h3>
                            <div className="row">
                                <div className="col-md-2">
                                    <label className="switch">
                                        <input type="checkbox" onClick={this.props.checkboxSwiched} />
                                        <span className="slider round" />
                                    </label>
                                </div>
                                {this.props.secretCode !== 0 ? <h3>{this.props.secretCode}</h3> : null}
                            </div>
                            <div style={{ marginTop: '20px', marginBottom: "20px", float: "right" }}>
                                <button type="submit"
                                    className="btn btn-primary btn-success"
                                    disabled={this.props.submitDisable}
                                >Submit</button>
                                <button type="button" className="btn" onClick={this.props.cancel}>Close</button>
                            </div>
                        </div>
                    </div>
                </form>
            </div >
        )
    }
}

export default postAnalyse;