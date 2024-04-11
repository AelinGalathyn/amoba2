import {useState, useEffect} from 'react';
import {joinLobby} from "../Apis.ts";

interface LobbyComponentProps {
    onGameStart: () => void;
}

export default function LobbyComponent({onGameStart}: LobbyComponentProps) {
    enum Status {
        Idle = 'idle',
        Searching = 'searching',
        Waiting = 'waiting',
        GameFound = 'gameFound',
    }

    const [status, setStatus] = useState<Status>(Status.Idle);

    useEffect(() => {
        let intervalId: ReturnType<typeof setInterval>;

        const search = async () => {
            try {
                const response = await joinLobby();
                console.log(response.gameStarted);
                if (response.gameStarted) {
                    onGameStart();
                    clearInterval(intervalId);
                    setStatus(Status.GameFound);
                } else {
                    if (status !== Status.Waiting) {
                        setStatus(Status.Waiting);
                    }
                }
            } catch (error) {
                console.error('Error searching for game:', error);
                clearInterval(intervalId);
                setStatus(Status.Idle);
            }
        };

        if (status === Status.Searching) {
            setStatus(Status.Waiting);
        }

        if (status === Status.Waiting || status === Status.Searching) {
            intervalId = setInterval(search, 1000);
        }

        return () => {
            clearInterval(intervalId);
        };
    }, [status, onGameStart]);

    const handleSearchForGame = () => {
        setStatus(Status.Searching);
    };

    return (
        <div className="d-flex flex-column align-items-center justify-content-center" style={{ minHeight: "100%" }}>
            <h1>Lobby</h1>
            {status === Status.Idle && <button id="joinButton" className="btn btn-success" onClick={handleSearchForGame}>Search for Game</button>}
            {status === Status.Searching && <p>Searching for a game...</p>}
            {status === Status.Waiting && <p>Waiting for an opponent...</p>}
            {status === Status.GameFound && <p>Game found! Redirecting...</p>}
        </div>

    );
}
