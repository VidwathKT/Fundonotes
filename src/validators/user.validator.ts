import { Request, Response, NextFunction } from 'express';

// Validator Functions
export const validateNewUser = (req: Request, res: Response, next: NextFunction): void => {
  const { firstName, lastName, email, password } = req.body;

  if (!firstName || typeof firstName !== 'string' || firstName.length < 2) {
    res.status(400).json({ error: 'Firstname must be a string and at least 2 characters long.' });
    return;
  }

  if (!lastName || typeof lastName !== 'string' || lastName.length < 2) {
     res.status(400).json({ error: 'Lastname must be a string and at least 2 characters long.' });
     return ;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
     res.status(400).json({ error: 'Invalid email address.' });
     return ;
  }

  if (!password || typeof password !== 'string' || password.length < 8) {
     res.status(400).json({ error: 'Password must be at least 8 characters long.' });
     return ;
  }

  next();
};

export const validateLoginUser = (req: Request, res: Response, next: NextFunction): void => {
  const { email, password } = req.body;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    res.status(400).json({ error: 'Invalid email address.' });
    return ;
  }

  if (!password || typeof password !== 'string' || password.length < 8) {
    res.status(400).json({ error: 'Password must be at least 8 characters long.' });
    return;
  }

  next();
};

export const validateForgetPassword = (req: Request, res: Response, next: NextFunction): void => {
  const { email } = req.body;
  if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
    return next(new Error('A valid email is required.'));
  }

  next();
};

export const validateResetPassword = (req: Request, res: Response, next: NextFunction): void => {
  const { Password } = req.body;

  if (!Password || Password.length < 8) {
    return next(new Error('Password is required and must be at least 8 characters.'));
  }

  next();
};

