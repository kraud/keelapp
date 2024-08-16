// src/middleware/socketMiddleware.ts
import { MiddlewareAPI, Dispatch, AnyAction } from '@reduxjs/toolkit'
import { socketService } from '../websockets/websocketService'
import {getNotifications, receive} from "../notifications/notificationSlice";

const socketMiddleware = () => {
    return (store: MiddlewareAPI<Dispatch<AnyAction>>) => {
        socketService.connect()

        const socket = socketService.getSocket()
        if (socket) {
            socket.on('notification received', (data) => {
                // NB! Not be using this:
                // store.dispatch(receive(data))
                // Because we can't simply push the notification received from BE, since those don't have the username data to be displayed
                // @ts-ignore
                store.dispatch(getNotifications())
            })
        }

        // NB! Not using this for sending notification (we're running socket.emit from createNotification.fulfilled in notificationSlice).
        // Info should be updated on destination AFTER notifications are created on BE (to avoid sending data that might fail to be stored in BE).
        // Could be needed for other use cases, so we leave the example as a comment.
        return (next: Dispatch<AnyAction>) => (action: AnyAction) => {
            // if (action.type === 'notification/send') {
            //     socket?.emit('new notification', action.payload)
            // }
            return next(action);
        }
    }
}

export default socketMiddleware;
