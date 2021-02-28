import React from 'react'
import "./message.css"

function Message(props) {
    const { message } = props;
    return (
        <div className="message__component">
            <p>{message}</p>
        </div>
    )
}

export default Message
