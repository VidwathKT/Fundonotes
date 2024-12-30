import { Request, Response, NextFunction } from 'express';
import HttpStatus from 'http-status-codes';


export const validateNewNote = (req: Request, res: Response, next: NextFunction): void => {
  const { title, description, color } = req.body;

  // Basic validations
  if (title && typeof title !== 'string') {
    res.status(HttpStatus.BAD_REQUEST).json({ message: 'Title must be a string' });
    return; 
  }
  if (description && typeof description !== 'string') {
    res.status(HttpStatus.BAD_REQUEST).json({ message: 'Description must be a string' });
    return;
  }
  if (color && typeof color !== 'string') {
    res.status(HttpStatus.BAD_REQUEST).json({ message: 'Color must be a string' });
    return;
  }

  
  if (!color) {
    req.body.color = '#FFFFFF';//default color
  }

  next();
};