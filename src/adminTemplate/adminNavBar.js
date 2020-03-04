import React from "react";
import "./adminTemplate.css";
import LanguagesContext from '../context/languages-context';

const adminNavigationBar = (props) => {
    return (
        <LanguagesContext.Consumer>
            {context =>
                <div>
                    <div className="row">
                        <div className="col-md-3 centered">
                            <button
                                className="btn labos-btn-custom btn-lg"
                                onClick={props.showApprovedRequest}
                                style={{ backgroundColor: 'green' }}
                            >
                                {context.t('approvedRequests')}
                            </button>
                        </div>
                        <div className="col-md-3 centered">
                            <button
                                className="btn labos-btn-custom btn-lg"
                                onClick={props.showAllRequests}
                            >
                                {context.t('allRequests')}
                            </button>
                        </div>
                        <div className="col-md-3 centered">
                            <button
                                className="btn labos-btn-custom btn-lg"
                                onClick={props.showPendingRequest}
                                style={{ backgroundColor: 'grey' }}
                            >
                                {context.t('pendingRequests')}
                            </button>
                        </div>
                        <div className="col-md-3 centered">
                            <button
                                className="btn labos-btn-custom btn-lg"
                                onClick={props.showRefusedRequest}
                                style={{ backgroundColor: 'red' }}
                            >
                                {context.t('refusedRequests')}
                            </button>
                        </div>
                    </div>
                    <div className="centered">
                        <form onSubmit={props.searchRequest}>
                            <input type="number" className="form-control"
                                placeholder={context.t('searchRequest_placeholder')}
                                onChange={props.requestSearchChange}
                                style={{ border: '1px solid black', marginTop: '20px' }} required />
                            <input type="submit" style={{ display: 'none' }} />
                        </form>
                    </div>
                </div>
            }
        </LanguagesContext.Consumer >
    );
};

export default adminNavigationBar;
