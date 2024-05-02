import type { Server, Socket } from 'socket.io';
import type { Message } from '../../types/socketIo';
import prisma from '../../libs/prisma';

export default function handleMessages(io: Server, socket: Socket) {
	socket.on('message', async (message: Message) => {
		console.log('Received message', message);

		if (!message.destinationType || !message.destinationId) {
			console.log('Invalid message');
			return;
		}

		const updateData = await prisma.group.update({
			where: {
				id: parseInt(message.destinationId),
				type: message.destinationType,
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
								type: true,
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

		updateData.Messages;

		io.to(`${message.destinationType}:${message.destinationId}`).emit(
			'message',
			updateData.Messages[0],
		);
	});
}
