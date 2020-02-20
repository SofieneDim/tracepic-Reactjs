import React from 'react'

const contractContext = React.createContext({
    contractInstance: null,
    web3: null,
    setFR: () => { },
    setEN: () => { },
    t: () => { }
})

export default contractContext