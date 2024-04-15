import {useEffect, useState} from "react";
import nullSession, {getGameState, play} from "../Apis.ts";

interface GameComponentProps {
    onGameEnd: () => void;
}

export default function GameComponent({onGameEnd}: GameComponentProps) {
    const initial: string[][] = Array(8).fill(null).map(() => Array(8).fill('.'));

    const [gameState, setGameState] = useState<string[][]>(initial);
    const [isActive, setIsActive] = useState<boolean>();
    const [timeRemaining, setTime] = useState<number>(0);
    const [playerRole, setPlayerRole] = useState<string>();

    let cleanupExecuted = false;

    useEffect(() => {
        console.log('poll1');
        const intervalId = setInterval(async () => {
            console.log('poll2');
            if (!cleanupExecuted) {
                try {
                    const response = await getGameState();
                    console.log('poll3');
                    setGameState(response.gameState);
                    setPlayerRole(response.playerRole);
                    setIsActive(response.isActive);
                    setTime(response.remainingTime);
                    if (response.win === 'true') {
                        cleanupExecuted = true;
                        clearInterval(intervalId);
                        nullSession();
                        onGameEnd();
                        alert('You lost.');
                    } else if (response.win === 'timeout') {
                        cleanupExecuted = true;
                        clearInterval(intervalId);
                        alert('Player timed out.')
                        nullSession();
                        onGameEnd();
                    }
                } catch {
                    console.log('catch');
                    cleanupExecuted = true;
                    onGameEnd();
                }

            }
        }, 500);

        return () => clearInterval(intervalId);
    }, [onGameEnd]);


    const handleMove = async (x: number, y: number) => {
        const response = await play({x, y});
        if (response.win === true) {
            cleanupExecuted = true;
            setGameState(response.gameState);
            alert('You win!');
            nullSession();
            onGameEnd();
        } else {
            const response2 = await getGameState();
            setGameState(response2.gameState);
            setIsActive(response2['isActive']);
        }
    }

    return (
        <div className="d-flex flex-column align-items-center justify-content-center" style={{minHeight: "100%"}}>
            {isActive ? `Time remaining: ${timeRemaining}` : null}
            <p>Active player: {isActive === true ? `you (${ playerRole === "player1" ? "X" : "O"})` : 'opponent'}</p>
            <table id="game-board">
                <tbody>
                {gameState.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                        {row.map((cell, columnIndex) => (
                            <td key={columnIndex}>
                                <button
                                    disabled={!isActive || cell !== '.'}
                                    onClick={() => handleMove(rowIndex, columnIndex)}
                                    style={{
                                        width: '50px',
                                        height: '50px',
                                        backgroundColor: '#8E526D',
                                        color: '#F2E0F5'
                                    }}>
                                    {cell !== '.' ? cell : ''}
                                </button>
                            </td>
                        ))}
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}