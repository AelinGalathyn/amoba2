import axios from 'axios';

const url = 'http://localhost:3000';
let sessionId: number = -1;

export const joinLobby = async () => {
    try {
        let body;
        if(sessionId != -1){
            body = {
                sessionId: sessionId,
                timeout: 2000,
            };
        }
        else {
            body = {
                timeout: 2000,
            }
        }

        const response = await axios.post(`${url}/lobby`, body);
        sessionId = response.data.sessionId;
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

export const getGameState = async () => {
    try {
        const response = await axios.get(`${url}/game/${sessionId}`, {
            timeout: 2000,
        });
        return response.data;
    } catch (error) {
        console.log(error);
    }
}

export const play = async (move: { x: number, y: number }) => {
    try {
        const response = await axios.post(`${url}/game/${sessionId}/play`, {
            'x': move.x,
            'y': move.y,
        }, {
            timeout: 2000,
        });
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

export default function nullSession(){
    sessionId = -1;
}