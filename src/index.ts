import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import helmet from 'helmet';
import errorMiddleware from './middlewares/error/errorMiddleware';

const app = express();
const PORT = process.env.PORT ?? 3001;

app.use(helmet());
app.use(express.json());

app.use(errorMiddleware);

(async () => {
  console.log('Connecting database...');
  await mongoose.connect('mongodb://127.0.0.1:27017/react-native-chat-app');
  console.log('Database connected');

  app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
})();
