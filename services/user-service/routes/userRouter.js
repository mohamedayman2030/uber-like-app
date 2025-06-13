import express from 'express';

import { signup, login, auth } from '../controllers/authUserController.js';

export const userRouter = express.Router();



userRouter.post('/signup',signup);

userRouter.post('/login',login);


