import { Router } from 'express';
import prisma from '../../libs/prisma';

const router = Router();

router.get('/:roomId', async (req, res) => {
	const { roomId } = req.params as {
		roomId: string;
	};

	if (!roomId) {
		return res.status(400).json({
			success: false,
			error: 'Érvénytelen szoba azonosító',
		});
	}

	const messages = await prisma.group.findUnique({
		where: {
			id: parseInt(roomId),
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
