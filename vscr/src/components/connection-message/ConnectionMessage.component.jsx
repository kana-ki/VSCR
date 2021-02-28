import React from 'react'
import "./connection-message.css"

function ConnectionMessage(props) {
    const { message } = props;
    return (
        <div className="connection-message__component">
            <p>{message}</p>
        </div>
    )
}

export default ConnectionMessage
