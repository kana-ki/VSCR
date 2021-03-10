import React, { Component } from 'react'
import "./client.css";
import Conversation from "../conversation/Conversation.component"
import InputWrapper from "../input-wrapper/InputWrapper.component"

class Client extends Component {
    constructor(props) {
        super(props);

        this.state = {
            message: "",
            conversation: []
        };

        const { websocket } = this.props;

        websocket.onmessage = (event) => {
            let message = event.data;
            if (message === "DEVDIS") {
                let disConnectMessage = {
                    data: "Stranger disconnected",
                    type: "disconnect"
                };
                this.setState({
                    conversation: this.state.conversation.concat(disConnectMessage)
                });
            } else if (message === "DEVCON") {
                let connectionMessage = {
                    data: "Stranger connected",
                    type: "connect"
                };
                this.setState({
                    conversation: this.state.conversation.concat(connectionMessage)
                });
            } else {
                let strangerMessage = {
                    data: message.split("MSGRCV")[1],
                    type: "stranger"
                };          
                this.setState({
                    conversation: this.state.conversation.concat(strangerMessage)
                });
            }
        }      

    }

    sendMessage = (event) => {
        const { websocket } = this.props;

        try {
            websocket.send(this.state.message);

            let userMessage = {
                data: this.state.message,
                type: "client"
            }
            this.setState({ conversation: this.state.conversation.concat(userMessage) });
        } catch (error) {
            console.log(error);
        }

        this.setState({
            message: ""
        });

        document.querySelector(".input-wrapper__text-area").value = "";

        event.preventDefault();
    }
    
    setMessageState = (value) => {
        this.setState({ message: value });
    }

    render() {
        return (
            <div className="client__component">
                <Conversation messages={this.state.conversation}/>
                <InputWrapper onChange={(value) => this.setMessageState(value)} sendEvent={this.sendMessage}/>
            </div>
        )
    }
}

export default Client
