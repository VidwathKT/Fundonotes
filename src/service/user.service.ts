import User from '../models/user.model';
import { IUser,LoginResponse } from '../interfaces/user.interface';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv'

dotenv.config();

export const newUserReg = async (body: IUser): Promise<IUser> => {
  const existingUser = await User.findOne({ email: body.email }).exec();
  if (existingUser) {
    throw new Error('Email ID already exists');
  }

  const hashedPassword = await bcrypt.hash(body.password, 10);
  body.password = hashedPassword;

  const data = await User.create(body);
  console.log(data);
  return data;
};


export const userLogin = async (body: { email: string; password: string }): Promise<LoginResponse> => {
  const data = await User.find({ email: body.email });
  if (data.length === 0) throw new Error('No user exists');

  const passwordMatch = await bcrypt.compare(body.password, data[0].password);
  if (!passwordMatch) throw new Error('Invalid Password');

  const payload = { userId: data[0]._id, email: data[0].email };

    const token = jwt.sign(payload, process.env.JWT_SECRET as string, { expiresIn: '1h' });
    const refreshToken = jwt.sign(payload, process.env.JWT_SECRET_REFRESH as string, { expiresIn: '7d' });

    await User.findOneAndUpdate({ _id: data[0]._id }, { refreshToken });

  return {
    token,
    refreshToken,
    firstName: data[0].firstName,
    lastName: data[0].lastName,
  };

};

