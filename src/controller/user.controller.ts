import {newUserReg,userLogin} from '../service/user.service';
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
    });
  } catch (error) {
    res.status(HttpStatus.BAD_REQUEST).json({
      code: HttpStatus.BAD_REQUEST,
      message: `${error}`,
    });
  }
};
