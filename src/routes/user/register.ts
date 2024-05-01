import { Router } from 'express';
import prisma from '../../libs/prisma';

const router = Router();

router.put('/', async (req, res) => {
	const { name, email, password } = req.body as {
		name: string;
		email: string;
		password: string;
	};

	if (!name) {
		return res.status(400).json({
			success: false,
			error: 'Név nincs megadva',
		});
	}
	if (!email) {
		return res.status(400).json({
			success: false,
			error: 'E-mail nincs megadva',
		});
	}
	if (!password) {
		return res.status(400).json({
			success: false,
			error: 'Jelszó nincs megadva',
		});
	}

	if (password.length < 8) {
		return res.status(400).json({
			success: false,
			error: 'A jelszónak legalább 8 karakter hosszúnak kell lennie',
		});
	} else if (!/[^a-zA-Z0-9]/.test(password)) {
		return res.status(400).json({
			success: false,
			error: 'A jelszónak legalább egy speciális karaktert kell tartalmaznia',
		});
	} else if (!/[A-Z]/.test(password)) {
		return res.status(400).json({
			success: false,
			error: 'A jelszónak legalább egy nagybetűt kell tartalmaznia',
		});
	} else if (!/[a-z]/.test(password)) {
		return res.status(400).json({
			success: false,
			error: 'A jelszónak legalább egy kisbetűt kell tartalmaznia',
		});
	} else if (!/[0-9]/.test(password)) {
		return res.status(400).json({
			success: false,
			error: 'A jelszónak legalább egy számot kell tartalmaznia',
		});
	} else if (/\s/.test(password)) {
		return res.status(400).json({
			success: false,
			error: 'A jelszó nem tartalmazhat szóközt',
		});
	} else if (password.includes(name)) {
		return res.status(400).json({
			success: false,
			error: 'A jelszó nem tartalmazhatja a nevet',
		});
	} else if (password.includes(email)) {
		return res.status(400).json({
			success: false,
			error: 'A jelszó nem tartalmazhatja az e-mailt',
		});
	}

	const checkEmail = await prisma.user.findUnique({
		where: {
			email,
		},
	});

	if (checkEmail) {
		return res.status(409).json({
			success: false,
			error: 'Az e-mail már létezik',
		});
	}

	const checkName = await prisma.user.findUnique({
		where: {
			name,
		},
	});

	if (checkName) {
		return res.status(409).json({
			success: false,
			error: 'A név már létezik',
		});
	}

	const user = await prisma.user.create({
		data: {
			name,
			email,
			password,
		},
	});

	return res.status(201).json({
		success: true,
		data: user,
	});
});
