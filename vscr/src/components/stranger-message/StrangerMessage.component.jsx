import React from 'react'
import "./stranger-message.css"

function StrangerMessage(props) {
    const { message } = props;
    return (
        <div className="stranger-message__component">
            <div className="stranger-message__container">
                <p>{message}</p>
            </div>
        </div>
    )
}

export default StrangerMessage
