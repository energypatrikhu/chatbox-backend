import { Router } from 'express';

import messagesRouter from '../routes/chat/messages';

const router = Router();

router.use('/messages', messagesRouter);

export default router;
