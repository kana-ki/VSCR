using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.WebSockets;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace VSCR.Extension
{
    public class SessionBroker
    {

        private ClientWebSocket _webSocket;
        private CancellationTokenSource _cancellationTokenSource;
        public event Func<Task> OnDevConnected;
        public event Func<Task> OnDevDisconnected;
        public event Func<string, Task> OnMessageReceived;

        public SessionBroker()
        {
            this._cancellationTokenSource = new CancellationTokenSource();
        }

        public async Task ConnectAsync()
        {
            this._webSocket = new ClientWebSocket();
            var cancellationToken = this._cancellationTokenSource.Token;
            await this._webSocket.ConnectAsync(new Uri("wss://visualstudiochatroulette.azurewebsites.net/chat"), cancellationToken);
            if (cancellationToken.IsCancellationRequested)
            {
                await this._webSocket.CloseAsync(WebSocketCloseStatus.NormalClosure, "Cancellation cancelled", CancellationToken.None);
                return;
            }
        }

        public async Task ListenAsync()
        {
            while (true)
            {
                var message = await this.ReceiveAsync();
                if (message.Type == WebSocketMessageType.Text)
                {
                    var command = message.Body.Substring(0, 6);
                    if (command == "MSGRCV")
                        this.OnMessageReceived(message.Body.Substring(6));
                    else if (command == "DEVCON")
                        this.OnDevConnected();
                    else if (command == "DEVDIS")
                        this.OnDevDisconnected();
                }
                else if (message.Type == WebSocketMessageType.Close)
                {
                    await this.DisconnectAsync();
                    break;
                }
            }

        }

        public async Task SendMessageAsync(string message)
        {
            var bytes = Encoding.UTF8.GetBytes(message);
            await this._webSocket.SendAsync(new ArraySegment<byte>(bytes), WebSocketMessageType.Text, true, this._cancellationTokenSource.Token);
        }

        public async Task DisconnectAsync()
        {
            this._cancellationTokenSource.Cancel();
            await this._webSocket.CloseAsync(WebSocketCloseStatus.NormalClosure, "Disconnected", CancellationToken.None);
            this._cancellationTokenSource = new CancellationTokenSource();
        }

        private async Task<ClientMessage> ReceiveAsync(CancellationToken? cancellationToken = null)
        {
            var buffer = new byte[1024 * 4];
            var result = await this._webSocket.ReceiveAsync(new ArraySegment<byte>(buffer), cancellationToken ?? CancellationToken.None);

            if (result.MessageType == WebSocketMessageType.Text)
            {
                var builder = new StringBuilder();

                while (true)
                {
                    var part = Encoding.UTF8.GetString(buffer, 0, result.Count);
                    builder.Append(part);
                    if (result.EndOfMessage) break;
                    result = await this._webSocket.ReceiveAsync(new ArraySegment<byte>(buffer), CancellationToken.None);
                }

                var message = builder.ToString();
                return new ClientMessage(message, result.MessageType);
            }

            return new ClientMessage(null, result.MessageType);
        }

    }
}
