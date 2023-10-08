import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import helmet from 'helmet';
import authRouter from './routes/auth';
import chatRouter from './routes/chat';
import errorMiddleware from './middlewares/error/errorMiddleware';
import websockets from './utils/websockets';

dotenv.config({ path: `.env.${process.env.NODE_ENV}` });
const app = express();
const PORT = process.env.PORT ?? 3001;

app.use(helmet());
app.use(express.json());

app.use('/auth', authRouter);
app.use('/chat', chatRouter);

app.use(errorMiddleware);

(async () => {
  console.log('Connecting database...');
  await mongoose.connect(`mongodb://${process.env.MONGO_DB_URL}/${process.env.MONGO_DB_NAME}`);
  console.log('Database connected');

  const server = app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
  websockets.start(server);
})();
