/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response, NextFunction } from 'express';
import HttpStatus from 'http-status-codes';

// to handle 404 not found errors.

export const notFound = (req: Request, res: Response): void => {
  if (!res.headersSent) {
    res.status(HttpStatus.NOT_FOUND).json({
      code: HttpStatus.NOT_FOUND,
      message: 'Ooops, route not found',
    });
  } else {
    console.error('Headers already sent, cannot send 404 response');
  }
};

export const appErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (err.code && typeof err.code === 'number') {
    console.error(`
      Status: ${err.code}
      Message: ${err.message}
      URL: ${req.originalUrl}
      Method: ${req.method}
      IP: ${req.ip}
    `);

    res.status(err.code).json({
      code: err.code,
      message: err.message,
    });
  } else {
    next(err);
  }
};

//to handle generic internal server errors.

export const genericErrorHandler = (
  err: any,
  req: Request,
  res: Response,
): void => {
  console.error(`
    Status: ${HttpStatus.INTERNAL_SERVER_ERROR}
    Message: ${err.stack}
    URL: ${req.originalUrl}
    Method: ${req.method}
    IP: ${req.ip}
  `);

  res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
    code: HttpStatus.INTERNAL_SERVER_ERROR,
    data: '',
    message: err.message,
  });
};
