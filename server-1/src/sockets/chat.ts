import { Server, Socket } from 'socket.io';

export const registerChatHandlers = (io: Server, socket: Socket) => {
    socket.on('whisper:send', ({ targetId, message }) => {
        socket.to(targetId).emit('whisper:recv', {
            message,
            senderId: socket.id,
        });
    });

    socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`);
    });
};