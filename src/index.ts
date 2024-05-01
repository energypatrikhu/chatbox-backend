import express from 'express';
import { createServer } from 'http';
import handleSocket from './socket';
import { Server } from 'socket.io';
import cors from 'cors';

const server = createServer();
const app = express();
handleSocket(new Server(server, { path: '/socket' }));

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

app.get('/', (req, res) => {
	res.send('Hello World!');
});

server.on('request', app);
server.listen(3000, () => {
	console.log('Server listening on port 3000');
});
