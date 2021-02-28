using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using System;
using System.Collections.Generic;
using System.Net.WebSockets;
using System.Threading;
using System.Threading.Tasks;

namespace VSCR.Api
{
    public class Startup
    {

        private Dictionary<Guid, Client> _clients;
        private SessionBroker _sessionBroker;

        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
            this._clients = new Dictionary<Guid, Client>();
            this._sessionBroker = new SessionBroker();
        }

        public IConfiguration Configuration { get; }

        public void ConfigureServices(IServiceCollection services) {}

        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app.UseWebSockets(new WebSocketOptions
            {
                KeepAliveInterval = TimeSpan.FromSeconds(120)
            });

            app.Use(HandleWebsocketRequests);

        }

        private async Task HandleWebsocketRequests(HttpContext context, Func<Task> next)
        {
            if (context.Request.Path.StartsWithSegments(new PathString("/chat")))
            {
                if (context.WebSockets.IsWebSocketRequest)
                {
                    var webSocket = await context.WebSockets.AcceptWebSocketAsync();
                    var client = new Client(webSocket);
                    this._sessionBroker.Handle(client);
                    await client.Run();
                }
                else
                {
                    context.Response.StatusCode = 400;
                }
            }
            else
            {
                await next();
            }
        }



    }
}
