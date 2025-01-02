import express, { Router } from 'express';
import {newUser,loginUser} from '../controller/user.controller';
import {validateNewUser,validateLoginUser,validateForgetPassword} from '../validators/user.validator';
import dotenv from 'dotenv';

dotenv.config();

const router: Router = express.Router();

// Define Routes
const userRoutes = (): Router => {

  router.post('/register',validateNewUser,newUser);

  router.post('/login',validateLoginUser,loginUser);

  router.post('/forgetPassword',validateForgetPassword,forgetPassword);
  
  
  return router;
};

export default userRoutes;
