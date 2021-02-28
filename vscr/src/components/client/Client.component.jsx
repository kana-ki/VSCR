import React, { Component } from 'react'
import "./client.css";

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
            const messageContainer = document.querySelector(".stranger__message");
            if (message === "DEVDIS") {
                messageContainer.innerHTML = "Stranger Disconnected";
            } else if (message === "DEVCON") {
                messageContainer.innerHTML = "Stranger Connected";
            } else {
                let strangerMessage = message.split("MSGRCV")[1];
                messageContainer.innerHTML = strangerMessage;
                
                this.setState({
                    conversation: this.state.conversation.concat(strangerMessage)
                });

                console.log(this.state.conversation);
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

    handleMessageChange = (event) => {
        this.setState({
            message: event.target.value
        });
    }
    
    render() {
        return (
            <div className="client__component">
                <form onSubmit={this.sendMessage}>
                    <label>Message</label>
                    <textarea className="client__textarea" type="text" value={this.state.message} onChange={this.handleMessageChange}></textarea>
                    <button type="submit">Send Message</button>
                </form>

                <h2>Stranger messages</h2>
                <div className="stranger__message">
                    There are no current messages....
                </div>
            </div>
        )
    }
}

export default Client
