import React from 'react'

const authContext = React.createContext({
    inPrivateKeyChanged: (event) => {},
    inEmailChanged: (event) => {},
    inPasswordChanged: (event) => {},
    upUsernameChanged: (event) => {},
    upEmailChanged: (event) => {},
    upPasswordChanged: (event) => {},
    upPasswordConfChanged: (event) => {}
})

export default authContext