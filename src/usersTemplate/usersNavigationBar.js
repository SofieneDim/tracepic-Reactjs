import React from "react";
import "./usersTemplate.css";
import LanguagesContext from '../context/languages-context';

const navigationBar = (props) => {
  return (
    <LanguagesContext.Consumer>
      {context =>
        <div className="col-md-12">
          <div>
            <div>
              <div>
                <button className="btn btn-custom btn-lg" onClick={props.forSale}>
                  {context.t('analysisForSale')}
                </button>
                <button className="btn btn-custom btn-lg" onClick={props.selfBought} style={{ backgroundColor: 'rgb(13, 105, 244)' }} >
                  {context.t('myBoughtAnalysis')}
                </button>
                <button className="btn btn-custom btn-lg" onClick={props.privateAnalyse} style={{ float: "right" }}>
                  {context.t('privateAnalysis')}
                </button>
              </div>
            </div>
          </div>
          <div className="centered">
            <form onSubmit={props.searchAnalyse}>
              <input type="text" className="form-control"
                placeholder={context.t('searchAnalysis_placeholder')}
                onChange={props.analyseSearchChange}
                style={{ border: '1px solid blue', marginTop: '20px' }} required
              />
              <input type="submit" style={{ display: 'none' }} />
            </form>
          </div>
        </div>
      }
    </LanguagesContext.Consumer>
  );
};

export default navigationBar;
