import React, { Component } from 'react'
import SendButton from '../send-button/SendButton.component'
import "./input-wrapper.css";

class InputWrapper extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="input-wrapper__component">
                <textarea type="text" onChange={(event) => { this.props.onChange(event.target.value) }}></textarea>
                <SendButton sendEvent={this.props.sendEvent}/>
            </div>
        )
    }
}

export default InputWrapper
