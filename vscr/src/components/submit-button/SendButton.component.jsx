import React from 'react'
import "./send-button.css"
import buttonIcon from "./button-icon.svg"

function SendButton(props) {
    const { sendEvent } = props;
    return (
        <div className="send-button__component">
            <button onClick={sendEvent}>
                <img src={buttonIcon} alt="Button Icon" aria-label="Button Icon"></img>
            </button>
        </div>
    )
}

export default SendButton
