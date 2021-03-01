import React from 'react'
import "./disconnect-message.css"

function DisconnectMessage(props) {
    const { message } = props;
    return (
        <div className="disconnect-message__component">
            <p>{message}</p>
        </div>
    )
}

export default DisconnectMessage
