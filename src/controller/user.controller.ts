import {newUserReg,userLogin} from '../service/user.service';
import { Request, Response } from 'express';
import HttpStatus from 'http-status-codes'


export const newUser = async (req: Request, res: Response): Promise<void> => {
  try {
    await newUserReg(req.body);
    res.status(HttpStatus.CREATED).json({
      code: HttpStatus.CREATED,
      message: `${req.body.Firstname} ${req.body.Lastname} registered successfully!`,
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
    const token = await userLogin(req.body);
    res.status(HttpStatus.OK).json({
      code: HttpStatus.OK,
      message: `${token[1]} ${token[2]} login Successful!`,
      token:token[0],
    });
  } catch (error) {
    res.status(HttpStatus.BAD_REQUEST).json({
      code: HttpStatus.BAD_REQUEST,
      message: `${error}`,
    });
  }
};
