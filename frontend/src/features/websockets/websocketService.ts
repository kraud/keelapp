// src/services/socketService.ts
import { io, Socket } from 'socket.io-client';
const BE_URL = process.env.REACT_APP_VERCEL_BE_URL
const user = JSON.parse(localStorage.getItem('user')! )

class SocketService {
    private socket: Socket | null = null;

    connect() {
        if (!this.socket && (user!!)) {
            // first we connect to socket on BE
            this.socket = io(BE_URL as string)
            // then we register to our "room", by sending our unique userID
            this.socket.emit('setup', user._id)
        }
    }

    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
        }
    }

    getSocket() {
        return this.socket;
    }
}

export const socketService = new SocketService();
