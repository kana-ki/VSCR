import './app.css';
import Client from './components/client/Client.component';
import Setup from './components/setup/Setup.component';

function App() {
    const messages = [{ message: "Lorem ipsum dolor.", type: "user" }, 
        { message: "Lorem ipsum dolor sit amet consectetur, adipiscing elit netus.", type: "stranger" },
        { message: "Lor.", type: "user" },
        { message: "Lorem ipsum dolor.", type: "stranger" },
        { message: "Ad lobortis quisque penatibus maecenas id, dictumst torquent venenatis.", type: "stranger" },
        { message: "Primis torquent pulvinar erat nam conubia dictum etiam magna cum parturient, massa velit est venenatis potenti suscipit cras vel feugiat integer sociosqu, platea ac porttitor non proin mus fringilla mauris consequat.", type: "stranger" },
        { message: "Lorem ipsum dolor.", type: "user" },
        { message: "Lo.", type: "stranger" },
        { message: "Pellentesque vehicula venenatis magna tortor nec, massa maecenas lobortis posuere.", type: "user" },
        { message: "Urna interdum commodo conubia pellentesque ultrices, ullamcorper vivamus tempor.", type: "stranger" }
    ];
    return (
        <div className="app__component">
            <main>
                <h1>Chat roulette</h1>
                {/* <Setup /> */}
                <Client />
            </main>
        </div>
    );
}

export default App;
