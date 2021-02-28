import React, { Component } from 'react'
import Input from '../input/Input.component'
import SendButton from '../submit-button/SendButton.component'
import "./input-wrapper.css";

class InputWrapper extends Component {
    constructor(props) {
        super(props);

        this.state = {
            message: ""
        };
    }

    sendData = (data) => {
        this.props.parentCallBack(data);
    }
    
    setMessageState = (value) => {
        this.setState({
            message: value
        })
        console.log(this.state.message)
        this.sendData(this.state.message);
    }

    render() {
        return (
            <div className="input-wrapper__component">
                <Input onChange={(value) => this.setMessageState(value)}/>
                <SendButton sendEvent={this.props.sendEvent}/>
            </div>
        )
    }
}

export default InputWrapper
