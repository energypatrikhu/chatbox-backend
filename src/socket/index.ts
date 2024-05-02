import type { Server } from 'socket.io';
import authSocket from './handlers/authSocket';
import handleMessages from './handlers/handleMessages';

export default function handleSocket(io: Server) {
	io.on('connection', async (socket) => {
		if (!(await authSocket(socket))) {
			return;
		}

		handleMessages(io, socket);
	});
}
