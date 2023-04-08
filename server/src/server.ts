import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import * as usersController from './controllers/users';
import authMiddleware from './middlewares/auth';
import cors from 'cors';
import logger from './logger/logger';
import loggingMiddleware from './middlewares/loggingMiddleware';


const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(loggingMiddleware);

app.get('/', (req, res) => {

    res.send("API is up");
});

app.post('/api/users', usersController.register);
app.post('/api/user/login', usersController.login);
app.get('/api/user', authMiddleware, usersController.currentUser);

io.on('connection', () => {
    console.log('Socket io is connected');
});

mongoose.connect('mongodb://localhost:27017/eltrello').then(() => {
    logger.info('Mongo connection successful');
    console.log('Connected to mongodb');
}).catch((err) => {
    logger.info('Error connecting to mongodb', err);
});

httpServer.listen(3000, () => {
    logger.info('API started on port 3000');
    console.log("API is listening on port 3000");
});