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

	const userContacts = await prisma.user.findFirst({
		where: {
			id: _userId,
		},
		select: {
			Contacts: {
				select: {
					id: true,
					name: true,
				},
			},
		},
	});

	if (!userContacts) {
		return res.status(404).json({
			success: false,
			error: 'Nem található',
		});
	}

	return res.status(200).json({
		success: true,
		data: userContacts.Contacts ?? [],
	});
});

router.patch('/:userId', async (req, res) => {
	const { userId } = req.params as {
		userId?: string;
	};
	const { loginId } = req.query as {
		loginId?: string;
	};
	const { contactIds } = req.body as {
		contactIds?: number[];
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

	if (!contactIds || !Array.isArray(contactIds)) {
		return res.status(400).json({
			success: false,
			error: 'Érvénytelen kapcsolat azonosítók',
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

	const userContacts = await prisma.user.findFirst({
		where: {
			id: _userId,
		},
		select: {
			Contacts: {
				select: {
					id: true,
				},
			},
		},
	});

	if (!userContacts) {
		return res.status(404).json({
			success: false,
			error: 'Nem található',
		});
	}

	const contactIdsSet = new Set(contactIds);
	const userContactIdsSet = new Set(
		userContacts.Contacts.map((contact) => contact.id),
	);

	const addContacts = contactIds.filter(
		(contactId) => !userContactIdsSet.has(contactId),
	);
	const removeContacts = userContacts.Contacts.filter(
		(contact) => !contactIdsSet.has(contact.id),
	);

	await prisma.user.update({
		where: {
			id: _userId,
		},
		data: {
			Contacts: {
				connect: addContacts.map((contactId) => ({
					id: contactId,
				})),
				disconnect: removeContacts.map((contact) => ({
					id: contact.id,
				})),
			},
		},
	});

	res.status(200).json({
		success: true,
	});
});

export default router;
