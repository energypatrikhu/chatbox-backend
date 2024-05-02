import { Router } from 'express';

import messagesRouter from '../routes/chat/messages';
import groupsRouter from '../routes/chat/groups';
import groupUsersRouter from '../routes/chat/group/users';

const router = Router();

router.use('/messages', messagesRouter);
router.use('/groups', groupsRouter);
router.use('/group/users', groupUsersRouter);

export default router;
