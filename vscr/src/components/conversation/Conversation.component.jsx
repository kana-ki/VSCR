import React, { Component } from 'react'
import Message from '../message/Message.component';
import "./conversation.css"
import StrangerMessage from "../stranger-message/StrangerMessage.component"

export class Conversation extends Component {
    render() {
        const { messages } = this.props;
        return (
            <div className="conversation__component">
                {
                    messages.map(message => {
                        if (message.type === "stranger") {
                            return <StrangerMessage message={message.message}></StrangerMessage>
                        } else {
                            return <Message message={message.message}/>
                        }
                    })
                }
            </div>
        )
    }
}

export default Conversation
