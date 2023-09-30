import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import * as usersController from './controllers/users';
import * as boardsController from './controllers/boards';
import authMiddleware from './middlewares/auth';
import cors from 'cors';
import logger from './logger/logger';
import loggingMiddleware from './middlewares/loggingMiddleware';
import swaggerUi from 'swagger-ui-express';
import * as swaggerDocument from './swagger.json';
import errorHandlerMiddlware from './middlewares/errorHandlerMiddware';
import compression from 'compression';
import helmet from 'helmet';
// import slowDown from 'express-slow-down';
import rateLimit from 'express-rate-limit';
import Config from './utils/configuration';
import morganMiddleware from "./middlewares/morgan";


// dotenv.config({ path: __dirname+'/.env' });

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

mongoose.set('toJSON', {
  virtuals: true,
  transform:(_, converted) => {
    delete converted._id;
  },
});

const limiter = rateLimit({
  windowMs: 15 * 60 * 10000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowsMS
});

/*const speedLimiter = slowDown({
    windowMs: 
})*/

app.use(cors());
app.use(compression());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(loggingMiddleware);
app.use(morganMiddleware);
app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get('/', (req, res) => {
  res.send('API is up');
});

app.post('/api/users', usersController.register);
app.post('/api/user/login', usersController.login);
app.get('/api/user', authMiddleware, usersController.currentUser);
app.get('/api/boards', authMiddleware, boardsController.getBoards);
app.post('/api/board', authMiddleware, boardsController.createBoard);

io.on('connection', () => {
  console.log('Socket io is connected');
});

const mongodbUrl = Config.mongodb_url;

mongoose
  .connect(`${mongodbUrl}`)
  .then(() => {
    logger.info('Mongo connection successful');
    console.log('Connected to mongodb');
  })
  .catch((err) => {
    logger.info('Error connecting to mongodb', err);
  });

app.use(errorHandlerMiddlware);

const port = Config.port || 3001;

httpServer.listen(port, () => {
  logger.info('API started on port 3000');
  console.log('API is listening on port 3000');
});
