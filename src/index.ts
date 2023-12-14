import dotenv from 'dotenv';
import express, { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import helmet from 'helmet';
import authRouter from './routes/auth';
import chatsRouter from './routes/chats';
import ApiError from './middlewares/error/ApiError';
import errorMiddleware from './middlewares/error/errorMiddleware';
import websockets from './modules/websockets';
import authMiddleware from './middlewares/authMiddleware';

switch (process.env.NODE_ENV) {
  case 'development': {
    dotenv.config({ path: `.env.development` });
  }
  case 'production': {
    dotenv.config({ path: __dirname + `/.env.production` });
  }
}

const app = express();
const PORT = process.env.PORT ?? 3001;

app.use(helmet());
app.use(express.json());

app.use('/auth', authRouter);
app.use(authMiddleware); // next routes requires authorization
app.use('/chats', chatsRouter);

// Handle wrong route
app.use((req: Request, res: Response, next: NextFunction) => {
  next(ApiError.notFound('Not found'));
  return;
});

app.use(errorMiddleware);

(async () => {
  console.log('Connecting database...');
  try {
    await mongoose.connect(`mongodb://${process.env.MONGO_DB_URL}/${process.env.MONGO_DB_NAME}`);
    console.log('Database connected');

    const server = app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
    websockets.start(server);
  } catch (error) {
    console.log(`Server startup error: ${error}`);
  }
})();
