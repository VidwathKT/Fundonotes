import jwt from 'jsonwebtoken';

export const createJwtToken = (payload: object, secret: string, expiresIn: string): string => {
    return jwt.sign(payload, secret, { expiresIn });
  };