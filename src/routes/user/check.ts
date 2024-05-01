import { Router } from 'express';
import prisma from '../../libs/prisma';

const router = Router();

router.get('/:loginId', async (req, res) => {
	const { loginId } = req.params satisfies {
		loginId: string;
	};

	if (!loginId) {
		return res.status(400).json({
			success: false,
			error: 'Érvénytelen login azonosító',
		});
	}

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

	return res.status(200).json({
		success: true,
		data: {
			id: checkLoginId.userId,
		},
	});
});

export default router;
