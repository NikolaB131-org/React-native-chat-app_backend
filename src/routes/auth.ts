import express from 'express';
import authContoller from '../modules/auth/auth.contoller';

const authRouter = express.Router();

authRouter.post('/login', authContoller.login);

export default authRouter;
