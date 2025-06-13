import express from 'express';

import { signup, login, auth } from '../controllers/authDriverController.js';


export const driverRouter = express.Router(); 

driverRouter.post('/signup',signup);


driverRouter.post('/login',login);