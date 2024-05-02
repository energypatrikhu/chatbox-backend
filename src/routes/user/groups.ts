import { Router } from 'express';
import prisma from '../../libs/prisma';

const router = Router();

router.get('/:userId', async (req, res) => {
	const { userId } = req.params as {
		userId?: string;
	};
	const { loginId } = req.query as {
		loginId?: string;
	};

	if (!userId) {
		return res.status(400).json({
			success: false,
			error: 'Érvénytelen felhasználói azonosító',
		});
	}
	if (!loginId) {
		return res.status(400).json({
			success: false,
			error: 'Érvénytelen bejelentkezési azonosító',
		});
	}

	const _userId = parseInt(userId);

	const checkLoginId = await prisma.login.findUnique({
		where: {
			loginId,
		},
	});

	if (!checkLoginId) {
		return res.status(404).json({
			success: false,
			error: 'Nem található',
		});
	}

	if (checkLoginId.userId !== _userId) {
		return res.status(404).json({
			success: false,
			error: 'Nem található',
		});
	}

	const userGroups = await prisma.user.findFirst({
		where: {
			id: _userId,
		},
		select: {
			Groups: true,
		},
	});

	if (!userGroups) {
		return res.status(404).json({
			success: false,
			error: 'Nem található',
		});
	}

	return res.status(200).json({
		success: true,
		data: userGroups.Groups ?? [],
	});
});

router.patch('/:userId', async (req, res) => {
	const { userId } = req.params as {
		userId?: string;
	};
	const { loginId } = req.query as {
		loginId?: string;
	};
	const { groupIds } = req.body as {
		groupIds?: number[];
	};

	if (!userId) {
		return res.status(400).json({
			success: false,
			error: 'Érvénytelen felhasználói azonosító',
		});
	}

	if (!loginId) {
		return res.status(400).json({
			success: false,
			error: 'Érvénytelen bejelentkezési azonosító',
		});
	}

	if (!groupIds || !Array.isArray(groupIds)) {
		return res.status(400).json({
			success: false,
			error: 'Érvénytelen csoport azonosítók',
		});
	}

	const _userId = parseInt(userId);

	const checkLoginId = await prisma.login.findUnique({
		where: {
			loginId,
		},
	});

	if (!checkLoginId) {
		return res.status(404).json({
			success: false,
			error: 'Nem található',
		});
	}

	if (checkLoginId.userId !== _userId) {
		return res.status(404).json({
			success: false,
			error: 'Nem található',
		});
	}

	const userGroups = await prisma.user.findFirst({
		where: {
			id: _userId,
		},
		select: {
			Groups: {
				select: {
					id: true,
				},
			},
		},
	});

	if (!userGroups) {
		return res.status(404).json({
			success: false,
			error: 'Nem található',
		});
	}

	const groupIdsSet = new Set(groupIds);
	const userGroupIdsSet = new Set(userGroups.Groups.map((group) => group.id));

	const addGroups = groupIds.filter(
		(groupId) => !userGroupIdsSet.has(groupId),
	);
	const removeGroups = userGroups.Groups.filter(
		(group) => !groupIdsSet.has(group.id),
	);

	await prisma.user.update({
		where: {
			id: _userId,
		},
		data: {
			Groups: {
				connect: addGroups.map((groupId) => ({
					id: groupId,
				})),
				disconnect: removeGroups.map((group) => ({
					id: group.id,
				})),
			},
		},
	});

	res.status(200).json({
		success: true,
	});
});

export default router;
