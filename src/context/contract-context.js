import React from 'react'

const contractContext = React.createContext({
    contractInstance: null,
    web3: null
})

export default contractContext