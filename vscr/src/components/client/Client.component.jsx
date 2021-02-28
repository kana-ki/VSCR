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
        } catch (error) {
            console.log(error);
        }

        event.preventDefault();
    }
    
    setMessageState = (value) => {
        this.setState({ message: value });
    }

    render() {
        const messages = [
            { data: "Stranger Connected", type: "connect" }, 
            { data: "Lorem ipsum dolor.", type: "user" }, 
            { data: "Lorem ipsum dolor sit amet consectetur, adipiscing elit netus.", type: "stranger" },
            { data: "Lor.", type: "user" },
            { data: "Lorem ipsum dolor.", type: "stranger" },
            { data: "Ad lobortis quisque penatibus maecenas id, dictumst torquent venenatis.", type: "stranger" },
            { data: "Primis torquent pulvinar erat nam conubia dictum etiam magna cum parturient, massa velit est venenatis potenti suscipit cras vel feugiat integer sociosqu, platea ac porttitor non proin mus fringilla mauris consequat.", type: "stranger" },
            { data: "Lorem ipsum dolor.", type: "user" },
            { data: "Lo.", type: "stranger" },
            { data: "Pellentesque vehicula venenatis magna tortor nec, massa maecenas lobortis posuere.", type: "user" },
            { data: "Urna interdum commodo conubia pellentesque ultrices, ullamcorper vivamus tempor.", type: "stranger" },
            { data: "Stranger Disconnected", type: "disconnect" }
        ];

        return (
            <div className="client__component">
                <Conversation messages={this.state.conversation}/>
                <InputWrapper onChange={(value) => this.setMessageState(value)} sendEvent={this.sendMessage}/>
            </div>
        )
    }
}

export default Client
