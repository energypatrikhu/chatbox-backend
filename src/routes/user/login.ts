import { Router } from 'express';
import prisma from '../../libs/prisma';

const router = Router();

router.patch('/', async (req, res) => {
	const { email, password } = req.body as {
		email: string;
		password: string;
	};

	if (!email || !password) {
		return res.status(400).json({
			success: false,
			error: 'Érvénytelen e-mail vagy jelszó',
		});
	}

	const checkUser = await prisma.user.findFirst({
		where: {
			email,
			password,
		},
		select: {
			id: true,
		},
	});

	if (!checkUser) {
		return res.status(404).json({
			success: false,
			error: 'Felhasználó nem található',
		});
	}

	const createLogin = await prisma.login.create({
		data: {
			userId: checkUser.id,
		},
	});

	return res.status(200).json({
		success: true,
		data: {
			loginId: createLogin.loginId,
		},
	});
});

export default router;
