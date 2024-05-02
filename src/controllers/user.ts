import { Router } from 'express';

import checkRouter from '../routes/user/check';
import contactsRouter from '../routes/user/contacts';
import groupsRouter from '../routes/user/groups';
import dataRouter from '../routes/user/data';
import loginRouter from '../routes/user/login';
import logoutRouter from '../routes/user/logout';
import registerRouter from '../routes/user/register';

const router = Router();

router.use('/check', checkRouter);
router.use('/contacts', contactsRouter);
router.use('/groups', groupsRouter);
router.use('/data', dataRouter);
router.use('/login', loginRouter);
router.use('/logout', logoutRouter);
router.use('/register', registerRouter);

export default router;
