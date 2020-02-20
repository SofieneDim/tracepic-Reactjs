import React, { Component } from 'react'
import LanguagesContext from '../context/languages-context'

class postAnalyse extends Component {

    state = {
        fileValue: false
    }

    swichValueTypeHandler() {
        this.setState({ fileValue: !this.state.fileValue })
    }

    render() {
        return (
            <LanguagesContext.Consumer>
                {context =>
                    <form onSubmit={this.props.submit}>
                        <div className="row">
                            <div className="col-md-12" style={{ border: '5px solid black', marginBottom: '50px', backgroundColor: "lightgray" }}>
                                <div>
                                    <div className="form-group" style={{ marginTop: '20px' }}>
                                        <label htmlFor="post-analyse-ref" className="centered">
                                            <b>{context.t('reference')} :</b>
                                        </label>
                                        <input type="text" className="form-control"
                                            id="post-analyse-ref"
                                            placeholder={context.t('reference_placeholder')}
                                            onChange={this.props.referenceChanged}
                                            required
                                        />
                                    </div>
                                    <div className="form-group" style={{ marginTop: '20px' }}>
                                        <label htmlFor="post-analyse-price" className="centered">
                                            <b>{context.t('price')}</b>
                                        </label>
                                        <input type="number" className="form-control"
                                            id="post-analyse-price"
                                            placeholder={context.t('price_placeholder')}
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
                                                <label htmlFor="post-analyse-price" className="centered">
                                                    <b>{context.t('value')} :</b>
                                                </label>
                                                <label className="centered">{this.props.analyseValue}</label>
                                            </div>
                                            : <div className="form-group centered" style={{ marginTop: '20px' }}>
                                                <input type="file" onChange={this.props.captureFile} />
                                            </div>
                                    }
                                </div>
                                <label className="centered">
                                    <b>{context.t('description')}</b>
                                </label>
                                <textarea type="text" className="form-control vresize"
                                    id="post-analyse-description"
                                    placeholder={context.t('description_placeholder')}
                                    onChange={this.props.descriptionChanged}
                                    required></textarea>
                                <h3 style={{ marginTop: "10px" }}>
                                    {this.props.secretCode == 0 ? context.t('makeItPrivate') : context.t('makeItPublic')}
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
                                    >{context.t('post')}</button>
                                    <button type="button" className="btn" onClick={this.props.cancel}>
                                        {context.t('close')}
                                    </button>
                                </div>

                            </div>
                        </div>
                    </form>
                }
            </LanguagesContext.Consumer>
        )
    }
}

export default postAnalyse;