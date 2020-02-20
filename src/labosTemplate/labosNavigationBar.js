import React from "react";
import "./labosTemplate.css";
import LanguagesContext from '../context/languages-context';

const labosNavigationBar = (props) => {
  return (
    <LanguagesContext.Consumer>
      {context =>
        <div className="col-md-12">
          <div>
            <div>
              <div>
                <button className="btn labos-btn-custom btn-lg" style={{ float: 'right' }} onClick={props.postAnalyse}>
                  {context.t('postAnalysis')}
                </button>
                <button className="btn labos-btn-custom btn-lg" onClick={props.postedAnalyses}>
                  {context.t('myPostedAnalysis')}
                </button>
                <button className="btn labos-btn-custom btn-lg" style={{ backgroundColor: 'grey' }} onClick={props.boughtAnalyses}>
                  {context.t('boughtAnalysis')}
                </button>
              </div>
            </div>
          </div>
          <div className="centered">
            <form onSubmit={props.searchAnalyse}>
              <input type="text" className="form-control"
                placeholder={context.t('searchAnalysis_placeholder')}
                onChange={props.analyseSearchChange}
                style={{ border: '1px solid black', marginTop: '20px' }} required />
              <input type="submit" style={{ display: 'none' }} />
            </form>
          </div>
        </div>
      }
    </LanguagesContext.Consumer>
  );
};

export default labosNavigationBar;
