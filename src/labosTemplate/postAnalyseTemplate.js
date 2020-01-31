import React, { Component } from 'react'

const postAnalyse = props => {

    return (
        <div>
            <form onSubmit={props.submit}>
                <div className="row">
                    <div className="col-md-12" style={{ border: '5px solid black', marginBottom: '50px', backgroundColor: "lightgray" }}>
                        <div>
                            <div className="form-group" style={{ marginTop: '20px' }}>
                                <label htmlFor="post-analyse-ref" className="centered">Reference:</label>
                                <input type="text" className="form-control"
                                    id="post-analyse-ref"
                                    placeholder="Enter analyse's address"
                                    onChange={props.referenceChanged}
                                    required
                                />
                            </div>
                            <div className="form-group" style={{ marginTop: '20px' }}>
                                <label htmlFor="post-analyse-price" className="centered">Price (in ETH):</label>
                                <input type="number" className="form-control"
                                    id="post-analyse-price"
                                    placeholder="Enter analyse's price"
                                    onChange={props.priceChanged}
                                    required
                                />
                            </div>
                            <div className="form-group" style={{ marginTop: '20px' }}>
                                <label htmlFor="post-analyse-price" className="centered">Value:</label>
                                <label className="centered" id="post-analyse-price">{props.analyseValue}</label>
                            </div>
                        </div>
                        <label className="centered">Description</label>
                        <textarea type="text" className="form-control vresize"
                            id="post-analyse-description"
                            placeholder="Describe your analyse"
                            onChange={props.descriptionChanged}
                            required></textarea>
                        <h3 style={{ marginTop: "10px" }}>Make it private analyse</h3>
                        <div className="row">
                            <div className="col-md-2">
                                <label className="switch">
                                    <input type="checkbox" onClick={ props.checkboxSwiched }/>
                                    <span className="slider round" />
                                </label>
                            </div>
                            {  props.secretCode  !== 0 ? <h3>{ props.secretCode }</h3> : null}
                        </div>
                        <div style={{ marginTop: '20px', marginBottom: "20px", float: "right" }}>
                            <button type="submit" className="btn btn-primary btn-success">Submit</button>
                            <button type="button" className="btn" onClick={ props.cancel }>Close</button>
                        </div>
                    </div>
                </div>
            </form>
        </div >
    )
}

export default postAnalyse;