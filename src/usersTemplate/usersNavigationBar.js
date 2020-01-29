import React from "react";
import "./usersTemplate.css";

const navigationBar = (props) => {
  return (
    <div>
      <div className="col-md-12">
        <div>
          <div>
            <div>
              <button className="btn btn-custom btn-lg" onClick={props.forSale}>
                Analyses for Sale
              </button>
              <button className="btn btn-custom btn-lg" onClick={props.selfBought} style={{ backgroundColor: 'rgb(13, 105, 244)' }} >
                My Bought Analyses
              </button>
              <button className="btn btn-custom btn-lg" onClick={props.privateAnalyse}  style={{ float: "right" }}>
                Private Analyses
              </button>
            </div>
          </div>
        </div>
        <div className="centered">
          <form >
            <input type="text" className="form-control" placeholder="Search by reference..."
              style={{ border: '1px solid blue', marginTop: '20px' }} required />
            <input type="submit" style={{ display: 'none' }} />
          </form>
        </div>
        <div style={{ marginTop: '20px', display: 'none' }}>
          <div className="centered">
            <h3 id="mining-progress">Mining in progress</h3>
          </div>
          <div className="centered">
            <div className="loader"></div>
          </div>
        </div>

        <div className="centered" style={{ marginTop: '20px', color: 'red', textAlign: 'center', display: 'none' }}>
          <h4 id="analyse-not-found">Sorry! <br /> there is no analyse with that reference</h4>
        </div>
      </div>
    </div>
  );
};

export default navigationBar;
