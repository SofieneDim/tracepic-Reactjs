import React, { Component } from 'react'
import languagesContext from '../context/languages-context'

class RequestTemplate extends Component {

    static contextType = languagesContext
    state = {
        showSecret: false,
        loading: false
    }

    render() {
        const { t } = this.context
        const color = this.props.request.pending ? 'grey' : this.props.request.approved ? 'green' : 'red'
        return (
            <div>
                <div id="analyses-template-panel" style={{ border: '3px solid ' + color }}>
                    <div id="analyses-template-header" style={{ backgroundColor: color }}>
                        <strong><span id="analyses-panel-title">
                            {t('laboName')}: {this.props.request.name}
                        </span></strong>
                    </div>
                    <div style={{ padding: '10px' }}>
                        <strong>{t('requestNumber')}:</strong> <span>{this.props.request.id}</span><br />
                        <strong>{t('demandeDate')}:</strong> <span>{this.props.request.date}</span> <br />
                        <strong>{t('emailAddress')}:</strong> <span>{this.props.request.email}</span> <br />
                        <strong>{t('laboAddress')}:</strong> <span>{this.props.request.phAddress}</span><br />
                    </div>
                    <div id="analyses-template-footer" style={{ backgroundColor: color, minHeight: '40px' }}>
                        {this.props.request.pending ?
                            [
                                <button
                                    type="button"
                                    key='1'
                                    className="btn btn-primary btn-danger"
                                    style={{ marginRight: '10px' }}
                                    onClick={() => this.props.refuse(this.props.id) }
                                >
                                    {t('refuse')}
                                </button>,
                                <button
                                    type="button"
                                    key='2'
                                    className="btn btn-primary btn-success"
                                    onClick={() => this.props.approve(this.props.id) }
                                >
                                    {t('approve')}
                                </button>
                            ]
                            :
                            null
                        }
                        <strong><span id="analyse-state">
                            {this.props.request.pending ? t('pending') : this.props.request.approved ? t('approved') : t('refused')}
                        </span></strong>
                        {
                            this.props.loading ?
                                <div
                                    className="analyse-loader"
                                    key="3"
                                    style={{ padding: '0', float: 'right', marginRight: '30%' }}
                                ></div>
                                :
                                null
                        }
                    </div>
                </div>
            </div >
        )
    }
}

export default RequestTemplate;