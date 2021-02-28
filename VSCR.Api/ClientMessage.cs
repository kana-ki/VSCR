using System.Diagnostics;
using System.Net.WebSockets;

namespace VSCR.Api
{
    [DebuggerDisplay("{Type} :: {Body}")]
    public record ClientMessage(string? Body, WebSocketMessageType Type);
}