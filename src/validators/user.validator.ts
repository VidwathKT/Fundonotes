import { Request, Response, NextFunction } from 'express';

// Validator Functions
export const validateNewUser = (req: Request, res: Response, next: NextFunction): void => {
  const { Firstname, Lastname, Email, Password } = req.body;

  if (!Firstname || typeof Firstname !== 'string' || Firstname.length < 2) {
    res.status(400).json({ error: 'Firstname must be a string and at least 2 characters long.' });
    return;
  }

  if (!Lastname || typeof Lastname !== 'string' || Lastname.length < 2) {
     res.status(400).json({ error: 'Lastname must be a string and at least 2 characters long.' });
     return ;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!Email || !emailRegex.test(Email)) {
     res.status(400).json({ error: 'Invalid email address.' });
     return ;
  }

  if (!Password || typeof Password !== 'string' || Password.length < 8) {
     res.status(400).json({ error: 'Password must be at least 8 characters long.' });
     return ;
  }

  next();
};

export const validateLoginUser = (req: Request, res: Response, next: NextFunction): void => {
  const { Email, Password } = req.body;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!Email || !emailRegex.test(Email)) {
    res.status(400).json({ error: 'Invalid email address.' });
    return ;
  }

  if (!Password || typeof Password !== 'string' || Password.length < 8) {
    res.status(400).json({ error: 'Password must be at least 8 characters long.' });
    return;
  }

  next();
};

