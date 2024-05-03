import type { Socket } from 'socket.io';
import prisma from '../../libs/prisma';

export default async function authSocket(socket: Socket) {
	const { userId } = socket.handshake.auth as {
		userId?: number;
	};

	// console.log('Authenticating socket');

	if (!userId) {
		// console.log('No user id');
		return socket.disconnect();
	}

	const user = await prisma.user.findUnique({
		where: {
			id: userId,
		},
		include: {
			Groups: true,
		},
	});

	if (!user) {
		// console.log('No user');
		return socket.disconnect();
	}

	// console.log('Socket authenticated, joining groups');

	for (const group of user.Groups) {
		socket.join(`${group.id}`);
		// console.log(`[${socket.id}] joining group ${group.id}`);
	}

	return user;
}
