import React, { Component } from 'react'
import SendButton from '../send-button/SendButton.component'
import "./input-wrapper.css";

class InputWrapper extends Component {
    render() {
        return (
            <div className="input-wrapper__component">
                <textarea className="input-wrapper__text-area" type="text" onChange={(event) => { this.props.onChange(event.target.value) }}></textarea>
                <SendButton sendEvent={this.props.sendEvent}/>
            </div>
        )
    }
}

export default InputWrapper
