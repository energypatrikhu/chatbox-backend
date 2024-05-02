import { Router } from 'express';
import prisma from '../../../libs/prisma';

const router = Router();

router.get('/:groupId', async (req, res) => {
	const { groupId } = req.params as {
		groupId: string;
	};

	if (!groupId) {
		return res.status(400).json({
			success: false,
			error: 'Érvénytelen csoport azonosító',
		});
	}

	const users = await prisma.group.findUnique({
		where: {
			id: parseInt(groupId),
		},
		select: {
			Users: {
				select: {
					id: true,
					name: true,
				},
			},
		},
	});

	res.json({
		success: true,
		data: users?.Users || [],
	});
});

router.post('/setLastOpened', async (req, res) => {
	const { userId, groupId } = req.body as {
		userId: string;
		groupId: string;
	};

	if (!groupId) {
		return res.status(400).json({
			success: false,
			error: 'Érvénytelen csoport azonosító',
		});
	}

	if (!userId) {
		return res.status(400).json({
			success: false,
			error: 'Érvénytelen felhasználói azonosító',
		});
	}

	await prisma.user.update({
		where: {
			id: parseInt(userId),
		},
		data: {
			lastOpened: parseInt(groupId),
		},
	});

	res.json({
		success: true,
	});
});

export default router;
