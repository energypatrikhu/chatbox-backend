import { Router } from 'express';
import prisma from '../../libs/prisma';

const router = Router();

router.get('/:roomType/:roomId', async (req, res) => {
	const { roomType, roomId } = req.params as {
		roomType: 'contact' | 'group';
		roomId: string;
	};

	if (!roomType || !roomId) {
		return res.status(400).json({
			success: false,
			error: 'Érvénytelen szoba típus vagy azonosító',
		});
	}

	const messages = await prisma.group.findUnique({
		where: {
			id: parseInt(roomId),
			type: roomType,
		},
		select: {
			Messages: {
				include: {
					User: true,
				},
				take: 100,
				orderBy: {
					createdAt: 'desc',
				},
			},
		},
	});

	res.json({
		success: true,
		data: messages?.Messages || [],
	});
});

export default router;
