import { Router } from 'express';
import prisma from '../../../libs/prisma';

const router = Router();

router.get('/:groupType/:groupId', async (req, res) => {
	const { groupType, groupId } = req.params as {
		groupType: string;
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
			type: groupType,
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
	const { userId, groupType, groupId } = req.body as {
		userId: string;
		groupType: string;
		groupId: string;
	};

	if (!groupId) {
		return res.status(400).json({
			success: false,
			error: 'Érvénytelen csoport azonosító',
		});
	}

	if (!groupType) {
		return res.status(400).json({
			success: false,
			error: 'Érvénytelen csoport típus',
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
			id: parseInt(groupId),
		},
		data: {
			lastOpened: `${groupType}:${groupId}`,
		},
	});

	res.json({
		success: true,
	});
});

export default router;
