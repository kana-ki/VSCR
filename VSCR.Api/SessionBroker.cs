using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;

namespace VSCR.Api
{
    internal class SessionBroker
    {

        private ConcurrentDictionary<Guid, Session> _activeSessions;
        private ConcurrentDictionary<Guid, Session> _openSessions;

        public SessionBroker() {
            this._activeSessions = new ConcurrentDictionary<Guid, Session>();
            this._openSessions = new ConcurrentDictionary<Guid, Session>();
        }

        internal void Handle(Client client)
        {
            if (!this._openSessions.Any())
            {
                new Session(this, client);
            } else
            {
                var session = this._openSessions.Skip(new Random().Next(0, this._openSessions.Count)).FirstOrDefault().Value;
                session.ConnectClient(client);
            }
        }

        internal void NotifyOpen(Session session)
        {
            this._activeSessions.TryRemove(session.Id, out _);
            this._openSessions.TryAdd(session.Id, session);
        }

        internal void NotifyActive(Session session)
        {
            this._openSessions.TryRemove(session.Id, out _);
            this._activeSessions.TryAdd(session.Id, session);
        }

        internal void NotifyDormant(Session session)
        {
            this._openSessions.TryRemove(session.Id, out _);
            this._activeSessions.TryRemove(session.Id, out _);
        }
    }
}
