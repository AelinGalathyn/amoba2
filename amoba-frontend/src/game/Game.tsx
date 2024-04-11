import {useEffect, useState} from "react";
import {getGameState, play} from "../Apis.ts";

interface GameComponentProps{
    onGameEnd: () => void;
}

export default function GameComponent({onGameEnd}: GameComponentProps){
    const initial: string[][] = Array(8).fill(null).map(() => Array(8).fill('.'));

    const [gameState, setGameState] = useState<string[][]>(initial);
    const [isActive, setIsActive] = useState<boolean>(false);

    useEffect(() => {
        console.log('poll1');
        const intervalId = setInterval(async () => {
            console.log('poll2');
            try {
                const response = await getGameState();
                setGameState(response.gameState);
                setIsActive(response.isActive);
                if (response.win) {
                    clearInterval(intervalId);
                    onGameEnd();
                }
            } catch {
                onGameEnd();
                alert('You lost.');
            }
        }, 500);

        return () => clearInterval(intervalId);
    }, [onGameEnd]);


    const handleMove = async (x: number, y: number) => {
        const response = await play({x, y});
        if(response.win === true){
            setGameState(response.gameState);
            alert('You win!');
            onGameEnd();
        }
        else {
            const response2 = await getGameState();
            setGameState(response2.gameState);
            setIsActive(response2['isActive']);
        }
    }

    return (
        <div>
            <table id="game-board">
                <tbody>
                {gameState.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                        {row.map((cell, columnIndex) => (
                            <td key={columnIndex}>
                                <button
                                    disabled={!isActive || cell !== '.'}
                                    onClick={() => handleMove(rowIndex, columnIndex)}
                                    style={{width: '50px', height: '50px'}}
                                >
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