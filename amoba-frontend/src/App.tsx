// App.jsx or App.tsx
import {useState} from 'react';
import LobbyComponent from './lobby/Lobby.tsx';
import GameComponent from "./game/Game.tsx";


function App() {
    const [gameStarted, setGameStarted] = useState(false);

    return (
        <div className="d-flex justify-content-center align-items-center vh-100">
            {gameStarted ? (<GameComponent onGameEnd={() => setGameStarted(false)}/>) : (<LobbyComponent onGameStart={() => setGameStarted(true)}/>)}
        </div>
    );
}

export default App;
