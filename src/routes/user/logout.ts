import { Router } from 'express';
import prisma from '../../libs/prisma';

const router = Router();

router.delete('/', async (req, res) => {
	const { loginId } = req.body as {
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
			error: 'Nem található',
		});
	}

	await prisma.login.delete({
		where: {
			loginId,
		},
	});

	return res.status(200).json({
		success: true,
	});
});

export default router;
