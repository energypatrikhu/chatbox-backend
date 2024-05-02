import { Router } from 'express';
import prisma from '../../libs/prisma';
import { io } from '../..';

const router = Router();

router.put('/createGroup', async (req, res) => {
	const { userId, groupName } = req.body as {
		userId?: number;
		groupName?: string;
	};

	if (!userId) {
		return res.status(400).json({
			success: false,
			error: 'Érvénytelen felhasználói azonosító',
		});
	}

	if (!groupName) {
		return res.status(400).json({
			success: false,
			error: 'Érvénytelen csoportnév',
		});
	}

	const group = await prisma.group.create({
		data: {
			name: groupName,
			type: 'group',
			Users: {
				connect: {
					id: userId,
				},
			},
		},
	});

	res.status(200).json({
		success: true,
		data: group,
	});
});

router.put('/addUser', async (req, res) => {
	const { userName, groupId } = req.body as {
		userName?: string;
		groupId?: string;
	};

	if (!userName) {
		return res.status(400).json({
			success: false,
			error: 'Érvénytelen felhasználónév',
		});
	}

	if (!groupId) {
		return res.status(400).json({
			success: false,
			error: 'Érvénytelen csoportazonosító',
		});
	}

	const user = await prisma.user.findUnique({
		where: {
			name: userName,
		},
	});

	if (!user) {
		return res.status(404).json({
			success: false,
			error: 'Nem található',
		});
	}

	const group = await prisma.group.findUnique({
		where: {
			id: parseInt(groupId),
		},
	});

	if (!group) {
		return res.status(404).json({
			success: false,
			error: 'Nem található',
		});
	}

	const checkUserGroup = await prisma.group.findFirst({
		where: {
			id: group.id,
			Users: {
				some: {
					id: user.id,
				},
			},
		},
	});

	if (checkUserGroup) {
		return res.status(400).json({
			success: false,
			error: 'A felhasználó már a csoport tagja',
		});
	}

	const addUser = await prisma.group.update({
		where: {
			id: group.id,
		},
		data: {
			Users: {
				connect: {
					id: user.id,
				},
			},
		},
		include: {
			Users: {
				where: {
					id: user.id,
				},
				select: {
					id: true,
					name: true,
				},
				take: 1,
			},
		},
	});

	io.emit('add-user', {
		...addUser,
		Users: addUser.Users[0],
	});

	res.status(200).json({
		success: true,
		data: {
			...addUser,
			Users: addUser.Users[0],
		},
	});
});

router.delete('/removeUser/:groupId/:userId', async (req, res) => {
	const { userId, groupId } = req.params as {
		userId?: string;
		groupId?: string;
	};

	if (!userId) {
		return res.status(400).json({
			success: false,
			error: 'Érvénytelen felhasználói azonosító',
		});
	}

	if (!groupId) {
		return res.status(400).json({
			success: false,
			error: 'Érvénytelen csoportazonosító',
		});
	}

	const user = await prisma.user.findUnique({
		where: {
			id: parseInt(userId),
		},
		select: {
			id: true,
			name: true,
		},
	});

	if (!user) {
		return res.status(404).json({
			success: false,
			error: 'Nem található',
		});
	}

	const group = await prisma.group.findUnique({
		where: {
			id: parseInt(groupId),
		},
	});

	if (!group) {
		return res.status(404).json({
			success: false,
			error: 'Nem található',
		});
	}

	const checkUserGroup = await prisma.group.findFirst({
		where: {
			id: group.id,
			Users: {
				some: {
					id: user.id,
				},
			},
		},
	});

	if (!checkUserGroup) {
		return res.status(400).json({
			success: false,
			error: 'A felhasználó nem a csoport tagja',
		});
	}

	const removeUser = await prisma.group.update({
		where: {
			id: group.id,
		},
		data: {
			Users: {
				disconnect: {
					id: user.id,
				},
			},
		},
	});

	io.emit('remove-user', {
		...removeUser,
		Users: user,
	});

	res.status(200).json({
		success: true,
		data: {
			...removeUser,
			Users: user,
		},
	});
});

export default router;
