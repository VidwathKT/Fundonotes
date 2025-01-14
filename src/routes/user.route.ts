import express, { Router } from 'express';
import {newUser,loginUser,forgetPassword,resetPassword,refreshToken} from '../controller/user.controller';
import {validateNewUser,validateLoginUser,validateForgetPassword,validateResetPassword} from '../validators/user.validator';
import dotenv from 'dotenv';
import { userAuth } from '../middlewares/auth.middleware';


dotenv.config();

const router: Router = express.Router();

// Define Routes
const userRoutes = (): Router => {

  router.post('/register',validateNewUser,newUser);

  router.post('/login',validateLoginUser,loginUser);

  router.post('/forgetPassword',validateForgetPassword,forgetPassword);

  router.put('/resetPassword',validateResetPassword,userAuth(process.env.JWT_FORGETSECRET!)
  ,resetPassword);

  router.get('/refreshToken',userAuth(process.env.JWT_SECRET_REFRESH!),refreshToken)
  return router;
};

export default userRoutes;
