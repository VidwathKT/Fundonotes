/* eslint-disable no-unused-vars */
import { Request, Response, NextFunction } from 'express';
import HttpStatus from 'http-status-codes';
import { body,param, validationResult,ValidationChain } from 'express-validator';

export const validateNewNote: (ValidationChain | ((req: Request, res: Response, next: NextFunction) => void))[] = [

  body('title')
    .optional()
    .isString()
    .withMessage('Title must be a string'),

  body('description')
    .optional()
    .isString()
    .withMessage('Description must be a string'),

  body('color')
    .optional()
    .isString()
    .withMessage('Color must be a string'),

  (req: Request, res: Response, next: NextFunction): Response | void => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        errors: errors.array(),
        message: 'Validation failed'
      });
    }

    if (!req.body.color) {
      req.body.color = '#FFFFFF'; // default color
    }

    next();
  },
];
export const validateNoteId: (ValidationChain | ((req: Request, res: Response, next: NextFunction) => void))[] = [

  param('noteId')
    .custom((value) => {
      return /^[a-fA-F0-9]{24}$/.test(value);
    })
    .withMessage('Invalid noteId'),

  (req: Request, res: Response, next: NextFunction): Response | void => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        errors: errors.array(),
        message: 'Validation failed',
      });
    }

    next();
  },
];