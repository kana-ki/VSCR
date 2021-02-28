import React, { Component } from 'react'
import Message from '../message/Message.component';
import "./conversation.css"
import StrangerMessage from "../stranger-message/StrangerMessage.component"
import ConnectionMessage from "../connection-message/ConnectionMessage.component"
import DisconnectMessage from "../disconnect-message/DisconnectMessage.component"

export class Conversation extends Component {
    render() {
        const { messages } = this.props;
        return (
            <div className="conversation__component">
                {
                    messages.map(message => {
                        if (message.type === "stranger") {
                            return <StrangerMessage message={message.data}/>
                        } else if (message.type === "connect") {
                            return <ConnectionMessage message={message.data}/>
                        } else if (message.type === "disconnect") {
                            return <DisconnectMessage message={message.data}/>
                        } else {
                            return <Message message={message.data}/>
                        }
                    })
                }
            </div>
        )
    }
}

export default Conversation
