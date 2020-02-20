import React from 'react'

const langContext = React.createContext({
    setFR: () => { },
    setEN: () => { },
    t: () => { }
})

export default langContext