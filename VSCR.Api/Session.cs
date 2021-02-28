using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace VSCR.Api
{
    internal class Session
    {

        private const int MAX_CLIENTS = 2;

        public Guid Id { get; init; }
        public IList<Client> Clients { get; init; }

        private readonly SessionBroker _sessionBroker;

        public Session(SessionBroker sessionBroker, Client firstClient)
        {
            this.Id = Guid.NewGuid();
            this.Clients = new List<Client>();
            this._sessionBroker = sessionBroker;
            this.ConnectClient(firstClient);
            this._sessionBroker.NotifyOpen(this);
        }

        public bool IsActive()
        {
            return this.Clients.Count >= MAX_CLIENTS;
        }

        internal void ConnectClient(Client newClient)
        {
            this.Clients.Add(newClient);
            newClient.AssignSession(this);
            if (this.Clients.Count >= MAX_CLIENTS)
            {
                this._sessionBroker.NotifyActive(this);
            }
            foreach (var client in this.Clients)
            {
                if (client == newClient) continue;
                _ = client.SendDevConnectedAsync();
                _ = newClient.SendDevConnectedAsync();
            }
        }

        internal async Task BroadcastMessageAsync(Client sender, string message)
        {
            foreach (var client in this.Clients)
            {
                if (client == sender) continue;
                await client.SendMessageReceivedAsync(message);
            }
        }

        internal void DisconnectClient(Client disconnectingClient)
        {
            this.Clients.Remove(disconnectingClient);
            disconnectingClient.UnassignSession();
            foreach (var client in this.Clients)
            {
                if (client == disconnectingClient) continue;
                _ = client.SendDevDisconnectedAsync();
            }
            if (this.Clients.Count < MAX_CLIENTS && this.Clients.Count > 0)
            {
                this._sessionBroker.NotifyOpen(this);
            }
            if (this.Clients.Count == 0)
            {
                this._sessionBroker.NotifyDormant(this);
            }
        }

    }
}
