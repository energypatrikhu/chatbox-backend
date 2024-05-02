import type { Server, Socket } from 'socket.io';
import type { Message } from '../../types/socketIo';

export default function handleMessages(io: Server, socket: Socket) {
	socket.on('message', async (message: Message) => {
		io.to(`${message.destinationType}:${message.destinationId}`).emit(
			'message',
			{
				senderId: message.senderId,
				text: message.text,
			},
		);
	});
}
