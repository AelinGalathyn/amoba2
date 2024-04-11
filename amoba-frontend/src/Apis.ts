import axios from 'axios';

const url = 'http://localhost:3000';

export const joinLobby = async () => {
    try {
        const response = await axios.get(`${url}/lobby`, {
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export const getGameState = async () => {
    try {
        const response = await axios.get(`${url}/game`, {
            withCredentials: true,
            timeout: 2000,
        });
        return response.data;
    } catch (error) {
        console.log(error);
    }
}

export const play = async (move: { x: number, y: number }) => {
    try {
        const response = await axios.post(`${url}/game/play`, {
            'x': move.x,
            'y': move.y,
        }, {
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        console.error(error);
    }
}