using System.Diagnostics;
using System.Net.WebSockets;

namespace VSCR.Extension
{
    [DebuggerDisplay("{Type} :: {Body}")]
    internal class ClientMessage
    {

        public string Body { get; }
        public WebSocketMessageType Type { get; }

        public ClientMessage(string message, WebSocketMessageType messageType)
        {
            this.Body = message;
            this.Type = messageType;
        }

    }
}