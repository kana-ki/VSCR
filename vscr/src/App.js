import './app.css';
import Message from './components/message/Message.component';
import Setup from './components/setup/Setup.component';

function App() {
    return (
        <div className="app__component">
            <main>
                <h1>Chat roulette</h1>
                <Setup />
                {/* <Message message="Hello World" ></Message> */}
            </main>
        </div>
    );
}

export default App;
