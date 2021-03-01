import React, { Component } from "react";
import Client from "../client/Client.component";
import { config } from "../../Config.js"
import LoadingContent from "../loading-content/LoadingContent.component"

class Setup extends Component {
    constructor(props) {
        super(props);

        this.state = {
            ws: null
        };
    }

    componentDidMount() {
        this.connect();
    }

    timeout = 250;

    connect = () => {
        let ws = new WebSocket(config.webSocketUrl);
        let that = this;
        let connectInterval;

        ws.onopen = () => {
            console.log("Connected websocket");

            this.setState({ws: ws});

            that.timeout = 250;
            clearTimeout(connectInterval);
        };

        ws.onclose = e => {
            console.log(
                `Socket is closed. Reconnect will be attempted in ${Math.min(
                    1000/10,
                    (that.timeout + that.timeout) / 100
                )} second.`,
                e.reason
            );
        };

        that.timeout = that.timeout + that.timeout;
        connectInterval = setTimeout(this.check, Math.min(10000, that.timeout));

        ws.onerror = err => {
            console.error(
                "Socket encountered error: ",
                err.message,
                "Closing socket"
            );

            ws.close();
        };
    }

    check = () => {
        const { ws } = this.state;
        if (!ws || ws.readyState == WebSocket.CLOSED) this.connect();
    }

    render() {
        if (this.state.ws === null) {
            return <LoadingContent />
        } else {
            return <Client websocket={this.state.ws} />
        }
    }
}

export default Setup
