import React from 'react'
import './labosTemplate.css'

import NavigationBar from './labosNavigationBar'
import AnalysesTemplate from '../analysesTemplate';

const labosTemplate = (props) => {

    

    const analyses = (
        <div>
            {
                props.analyses.map((analyse) => {
                    return <AnalysesTemplate
                        value={analyse.value}
                        price={analyse.price}
                        date={analyse.date}
                        key={analyse.id}
                        color={'black'}
                        description={analyse.description}
                    />
                })
            }
        </div>
    )


    return (< div >
        <div className="jumbotron" id="labos-jumbotron"></div>

        <NavigationBar />

        <div className="row" style={{ marginTop: '30px' }}>
            <div className="col-md-12" style={{ padding: '0px' }}>
                {analyses}
            </div>
        </div>
    </div >
    )
}

export default labosTemplate;