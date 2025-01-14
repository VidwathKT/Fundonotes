/* eslint-disable @typescript-eslint/no-explicit-any */

import HttpStatus from 'http-status-codes';
import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

export const userAuth = (secret: string) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const authHeader = req.header('Authorization');
      if (!authHeader) {
        throw new Error('Authorization token is required')
      }
      const bearerToken = authHeader.split(' ')[1];
      if (!bearerToken) {
        return next({
            code: HttpStatus.BAD_REQUEST,
             message: 'Authorization token is required',
            });
      }

      const user: any = jwt.verify(bearerToken, secret) as {_id: string};
      req.body.createdBy = user.userId;
      req.body.email = user.email;
      next();
    } catch (error) {
      next(error);
    }
  };
};