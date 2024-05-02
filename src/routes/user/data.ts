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

	const userData = await prisma.user.findUnique({
		where: {
			id: _userId,
		},
		select: {
			id: true,
			name: true,
			email: true,
			lastOpened: true,
		},
	});

	if (!userData) {
		return res.status(404).json({
			success: false,
			error: 'Nem található',
		});
	}

	return res.status(200).json({
		success: true,
		data: userData,
	});
});

router.patch('/:userId', async (req, res) => {
	const { userId } = req.params as {
		userId?: string;
	};
	const { loginId } = req.query as {
		loginId?: string;
	};
	const { name, email } = req.body as {
		name?: string;
		email?: string;
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
	if (!name || !email) {
		return res.status(400).json({
			success: false,
			error: 'Érvénytelen név vagy e-mail',
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

	const updateUserData = await prisma.user.update({
		where: {
			id: _userId,
		},
		data: {
			name,
			email,
		},
	});

	return res.status(200).json({
		success: true,
		data: updateUserData,
	});
});

export default router;
