using System;
using System.Collections.Generic;
using System.Net.WebSockets;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace VSCR.Api
{
    internal class Client
    {
        public Guid Id { get; }

        public WebSocket WebSocket { get; init; }
        public Session? Session { get; private set; }

        public Client(WebSocket _webSocket)
        {
            this.Id = Guid.NewGuid();
            this.WebSocket = _webSocket;
        }

        public async Task Run()
        {
            while (true)
            {
                var message = await this.ReceiveAsync();

                if (message.Type == WebSocketMessageType.Text)
                {
                    await this.Session?.BroadcastMessageAsync(this, message.Body);
                }
                else if (message.Type == WebSocketMessageType.Close)
                {
                    await this.WebSocket.CloseOutputAsync(WebSocketCloseStatus.NormalClosure, "", CancellationToken.None);
                    this.Session?.DisconnectClient(this);
                    break;
                }
            }
        }

        internal void AssignSession(Session session)
        {
            if (this.Session != null)
            {
                this.Session.DisconnectClient(this);
            }
            this.Session = session;
        }

        internal void UnassignSession()
        {
            this.Session = null;
        }

        public async Task<ClientMessage> ReceiveAsync(CancellationToken? cancellationToken = null)
        {
            var buffer = new byte[1024 * 4];
            var result = await this.WebSocket.ReceiveAsync(new ArraySegment<byte>(buffer), cancellationToken ?? CancellationToken.None);

            if (result.MessageType == WebSocketMessageType.Text)
            {
                var builder = new StringBuilder();

                while (true)
                {
                    var part = Encoding.UTF8.GetString(buffer, 0, result.Count);
                    builder.Append(part);
                    if (result.EndOfMessage) break;
                    result = await this.WebSocket.ReceiveAsync(new ArraySegment<byte>(buffer), CancellationToken.None);
                }

                var message = builder.ToString();
                return new ClientMessage(message, result.MessageType);
            }

            return new ClientMessage(null, result.MessageType);
        }

        public async Task SendMessageReceivedAsync(string message)
        {
            var transmission = MessageType.MessageReceived.AsTypeCode() + message;
            await Send(transmission);
        }

        public async Task SendDevConnectedAsync()
        {
            var transmission = MessageType.DevConnected.AsTypeCode();
            await Send(transmission);
        }

        public async Task SendDevDisconnectedAsync()
        {
            var transmission = MessageType.DevDisconnected.AsTypeCode();
            await Send(transmission);
        }

        private async Task Send(string transmission)
        {
            var bytes = Encoding.UTF8.GetBytes(transmission);
            await this.WebSocket.SendAsync(bytes, WebSocketMessageType.Text, true, CancellationToken.None);
        }

    }

    public enum MessageType
    {
        MessageReceived,
        DevConnected,
        DevDisconnected
    }

    public static class MessageTypeExtensions {

        public static string AsTypeCode(this MessageType messageType)
        {
            return new Dictionary<MessageType, string>
            {
                {  MessageType.MessageReceived, "MSGRCV" },
                {  MessageType.DevConnected, "DEVCON" },
                {  MessageType.DevDisconnected, "DEVDIS" }
            }[messageType];
        }

    }
}