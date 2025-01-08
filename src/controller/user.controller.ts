import {newUserReg,userLogin,forgetPasswordService,resetPasswordService,refreshTokenService} from '../service/user.service';
import { Request, Response } from 'express';
import HttpStatus from 'http-status-codes'


export const newUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const newUser = await newUserReg(req.body);
    res.status(HttpStatus.CREATED).json({
      code: HttpStatus.CREATED,
      data: newUser,
      message: `${newUser.firstName} ${newUser.lastName} registered successfully!`,
    });
  } catch (error) {
    res.status(HttpStatus.BAD_REQUEST).json({
      code: HttpStatus.BAD_REQUEST,
      message: `${error}`,
    });
  }
};

export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await userLogin(req.body);
    res.status(HttpStatus.OK).json({
      code: HttpStatus.OK,
      message: `${user.firstName} ${user.lastName} login Successful!`,
      token:user.token,
      refreshToken:user.refreshToken,
    });
  } catch (error) {
    res.status(HttpStatus.BAD_REQUEST).json({
      code: HttpStatus.BAD_REQUEST,
      message: `${error}`,
    });
  }
};

export const forgetPassword = async(req: Request, res: Response): Promise<void> => {
  try {
    await forgetPasswordService(req.body);
    res.status(HttpStatus.OK).json({
      code: HttpStatus.OK,
      message: `Token sent to Email Successfully`,
    });
  } catch (error) {
    res.status(HttpStatus.BAD_REQUEST).json({
      code: HttpStatus.BAD_REQUEST,
      message: `${error}`,
    });
  }
};

export const resetPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    await resetPasswordService(req.body);
    res.status(HttpStatus.OK).json({
      code: HttpStatus.OK,
      message: 'Password reset Successfully',
    });
  } catch (error) {
    res.status(HttpStatus.BAD_REQUEST).json({
      code: HttpStatus.BAD_REQUEST,
      message: `${error}`,
    });
  }
};

export const refreshToken = async(req: Request,res:Response):Promise<void> =>{
  try{
    const newToken = await refreshTokenService(req.body);
    res.status(HttpStatus.OK).json({
      code: HttpStatus.OK,
      message: 'Token is refreshed',
      token:newToken,
    });
  }
  catch(error){
    res.status(HttpStatus.BAD_REQUEST).json({
      code: HttpStatus.BAD_REQUEST,
      message: `${error}`,
    });
  }
};