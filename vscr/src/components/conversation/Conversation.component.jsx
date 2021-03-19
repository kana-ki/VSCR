import React, { Component } from 'react'
import Message from '../message/Message.component';
import "./conversation.css"
import StrangerMessage from "../stranger-message/StrangerMessage.component"
import ConnectionMessage from "../connection-message/ConnectionMessage.component"
import DisconnectMessage from "../disconnect-message/DisconnectMessage.component"
import LoadingContent from '../loading-content/LoadingContent.component';

export class Conversation extends Component {
    render() {
        const { messages } = this.props;

        return (
            <div className="conversation__component">
                {messages.length === 0 ? <LoadingContent message={"Trying to find stranger..."}></LoadingContent> : null}
                {
                    messages.map((message, key) => {
                        if (message.type === "stranger") {
                            return <StrangerMessage key={key} message={message.data}/>
                        } else if (message.type === "connect") {
                            return <ConnectionMessage key={key} message={message.data}/>
                        } else if (message.type === "disconnect") {
                            return <DisconnectMessage key={key} message={message.data}/>
                        } else {
                            return <Message key={key} message={message.data}/>
                        }
                    })
                }
            </div>
        )
    }
}

export default Conversation
