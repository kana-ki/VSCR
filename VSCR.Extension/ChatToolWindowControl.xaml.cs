using Microsoft.VisualStudio.Shell;
using System.Windows.Media;
using System.Threading;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Documents;
using System.Windows.Input;
using Task = System.Threading.Tasks.Task;

namespace VSCR.Extension
{
    public partial class ChatToolWindowControl : UserControl
    {
        private readonly SessionBroker _sessionBroker;

        public ChatToolWindowControl(SessionBroker sessionBroker)
        {
            this._sessionBroker = sessionBroker;
            this._sessionBroker.OnDevConnected += OnDevConnectedAsync;
            this._sessionBroker.OnDevDisconnected += OnDevDisconnectedAsync;
            this._sessionBroker.OnMessageReceived += OnMessageReceivedAsync;
            this.InitializeComponent();
        }

        private async Task OnMessageReceivedAsync(string message)
        {
            await ThreadHelper.JoinableTaskFactory.SwitchToMainThreadAsync();

            Paragraph paragraph = new Paragraph();
            var senderRun = new Run("Developer: ");
            senderRun.Foreground = Brushes.CadetBlue;
            senderRun.FontWeight = FontWeights.Bold;
            paragraph.Inlines.Add(senderRun);

            paragraph.Inlines.Add(message);

            this.ChatTextBlock.Document.Blocks.Add(paragraph);
        }

        private async Task OnDevConnectedAsync()
        {
            await ThreadHelper.JoinableTaskFactory.SwitchToMainThreadAsync();
            this.MessageTextBox.IsEnabled = true;

            Paragraph paragraph = new Paragraph();
            paragraph.Inlines.Add("Developer connected.");
            paragraph.Foreground = Brushes.Gray;
            this.ChatTextBlock.Document.Blocks.Add(paragraph);
        }

        private async Task OnDevDisconnectedAsync()
        {
            await ThreadHelper.JoinableTaskFactory.SwitchToMainThreadAsync();
            this.MessageTextBox.IsEnabled = false;

            Paragraph paragraph = new Paragraph();
            paragraph.Inlines.Add("Developer disconnected.");
            paragraph.Foreground = Brushes.Gray;
            this.ChatTextBlock.Document.Blocks.Add(paragraph);
        }

        private void Connect(object sender, RoutedEventArgs e)
        {

            var paragraph = new Paragraph();
            paragraph.Inlines.Add("Connecting...");
            paragraph.Foreground = Brushes.Gray;
            this.ChatTextBlock.Document.Blocks.Clear();
            this.ChatTextBlock.Document.Blocks.Add(paragraph);

            this.ConnectButton.Visibility = Visibility.Hidden;
            this.DisconnectButton.Visibility = Visibility.Visible;

            _ = this._sessionBroker.ConnectAsync().ContinueWith(async result => {
                await ThreadHelper.JoinableTaskFactory.SwitchToMainThreadAsync();

                Paragraph paragraph2 = new Paragraph();
                if (result.IsFaulted)
                {
                    paragraph2.Inlines.Add("Could not connect.\n");
                }
                else
                {
                    paragraph2.Inlines.Add("Connected.\n");
                    paragraph2.Inlines.Add("Finding a developer...");
                }
                paragraph2.Foreground = Brushes.Gray;
                this.ChatTextBlock.Document.Blocks.Add(paragraph2);

            }, TaskScheduler.Current).ContinueWith(async result => {
                await this._sessionBroker.ListenAsync();
            }, TaskScheduler.Default);
        }

        private void Disconnect(object sender, RoutedEventArgs e)
        {
            this.ConnectButton.Visibility = Visibility.Visible;
            this.DisconnectButton.Visibility = Visibility.Hidden;
            _ = this._sessionBroker.DisconnectAsync();

            Paragraph paragraph = new Paragraph();
            paragraph.Inlines.Add("Disconnected.");
            paragraph.Foreground = Brushes.Gray;
            this.ChatTextBlock.Document.Blocks.Add(paragraph);
        }

        private void IfEnterSendMessage(object sender, KeyEventArgs e)
        {
            if (e.Key == Key.Enter)
            {
                _ = this._sessionBroker.SendMessageAsync(this.MessageTextBox.Text);
                var message = this.MessageTextBox.Text;
                this.MessageTextBox.Text = "";

                Paragraph paragraph = new Paragraph();
                var senderRun = new Run("You: ");
                senderRun.Foreground = Brushes.PaleVioletRed;
                senderRun.FontWeight = FontWeights.Bold;
                paragraph.Inlines.Add(senderRun);

                paragraph.Inlines.Add(message);

                this.ChatTextBlock.Document.Blocks.Add(paragraph);
            }
        }
    }
}