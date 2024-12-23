import {newUserReg,userLogin} from '../service/user.service';
import { Request, Response } from 'express';



export const newUser = async (req: Request, res: Response): Promise<void> => {
  try {
    await newUserReg(req.body);
    res.status(201).json({
      code: 201,
      message: `${req.body.Firstname} ${req.body.Lastname} registered successfully!`,
    });
  } catch (error) {
    res.status(400).json({
      code: 400,
      message: `${error}`,
    });
  }
};

export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const token = await userLogin(req.body);
    res.status(200).json({
      code: 200,
      message: `${token.message} login successful!`,
      //token: token[0],
    });
  } catch (error) {
    res.status(400).json({
      code: 400,
      message: `${error}`,
    });
  }
};
