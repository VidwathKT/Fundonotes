import express, { Router } from 'express';
import {newUser,loginUser} from '../controller/user.controller';
import {validateNewUser,validateLoginUser} from '../validators/user.validator';
import dotenv from 'dotenv';

dotenv.config();

const router: Router = express.Router();

// Define Routes
const userRoutes = (): Router => {

  router.post('/register',validateNewUser,newUser);

  router.post('/login',validateLoginUser,loginUser);

  return router;
};

export default userRoutes;
