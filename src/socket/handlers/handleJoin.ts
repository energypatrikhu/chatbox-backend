import type { Socket } from 'socket.io';

export default function handleJoin(socket: Socket) {
	socket.on('join', (room) => {
		socket.join(room);
		// console.log(`[${socket.id}] joining group ${room}`);
	});
}
