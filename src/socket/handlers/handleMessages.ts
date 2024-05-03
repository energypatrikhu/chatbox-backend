import type { Server, Socket } from 'socket.io';
import type { Message } from '../../types/socketIo';
import prisma from '../../libs/prisma';

export default function handleMessages(io: Server, socket: Socket) {
	socket.on('message', async (message: Message) => {
		console.log('Received message', message);

		if (!message.destinationId) {
			console.log('Invalid message');
			return;
		}

		const updateData = await prisma.group.update({
			where: {
				id: parseInt(message.destinationId),
			},
			data: {
				Messages: {
					create: {
						User: {
							connect: {
								id: parseInt(message.senderId),
							},
						},
						text: message.text,
					},
				},
			},
			include: {
				Messages: {
					where: {
						userId: parseInt(message.senderId),
					},
					include: {
						User: {
							select: {
								id: true,
								name: true,
							},
						},
						Group: {
							select: {
								id: true,
							},
						},
					},
					take: 1,
					orderBy: {
						createdAt: 'desc',
					},
				},
			},
		});

		io.to(message.destinationId).emit('message', updateData.Messages[0]);
	});
}
