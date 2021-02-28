import React, { Component } from 'react'
import "./client.css";
import Conversation from "../conversation/Conversation.component"
import InputWrapper from "../input-wrapper/InputWrapper.component"
import Input from '../input/Input.component';
import SendButton from '../submit-button/SendButton.component';

class Client extends Component {
    constructor(props) {
        super(props);

        this.state = {
            message: "",
            conversation: []
        };

        // const { websocket } = this.props;

        // websocket.onmessage = (event) => {
        //     let message = event.data;
        //     const messageContainer = document.querySelector(".stranger__message");
        //     if (message === "DEVDIS") {
        //         messageContainer.innerHTML = "Stranger Disconnected";
        //     } else if (message === "DEVCON") {
        //         messageContainer.innerHTML = "Stranger Connected";
        //     } else {
        //         let strangerMessage = message.split("MSGRCV")[1];
        //         messageContainer.innerHTML = strangerMessage;
                
        //         this.setState({
        //             conversation: this.state.conversation.concat(strangerMessage)
        //         });

        //         console.log(this.state.conversation);
        //     }
        // }      

    }

    sendMessage = (event) => {
        const { websocket } = this.props;

        try {
            websocket.send(this.state.message);
        } catch (error) {
            console.log(error);
        }

        event.preventDefault();
    }
    
    setMessageState = (value) => {
        this.setState({
            message: value
        })
        console.log(this.state.message)
        console.log("parent")
    }

    fakeMethod = () => {
        console.log("I've sent the message", this.state.message);
    }

    callBackFunction = (childData) => {
        this.setState({
            message: childData
        });
        console.log("parent getting hit", this.state.message)
    }

    render() {
        return (
            <div className="client__component">
                {/* <Conversation messages={this.state.conversation}/> */}
                <InputWrapper parentCallBack={this.callBackFunction} sendEvent={this.fakeMethod}/>
                {/* <Input onChange={(value) => this.setMessageState(value)}></Input> */}
                {/* <SendButton sendEvent={this.fakeMethod}/> */}
            </div>
        )
    }
}

export default Client
