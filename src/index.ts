import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import handleSocket from './socket';

import userController from './controllers/user';

const app = express();
const server = createServer(app);
handleSocket(new Server(server, { path: '/socket', cors: { origin: '*' } }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const corsSettings = {
	origin: '*',
	credentials: true,
	methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
	preflightContinue: false,
	optionsSuccessStatus: 204,
} satisfies cors.CorsOptions;
app.use(cors(corsSettings));

app.use('/user', userController);

server.listen(3000, () => {
	console.log('Server listening on port 3000');
});
