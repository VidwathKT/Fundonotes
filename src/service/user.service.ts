import User from '../models/user.model';
import { IUser } from '../interfaces/user.interface';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';


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


export const userLogin = async (body: { email: string; password: string }): Promise<any> => {
  const data = await User.find({ email: body.email });
  if (data.length === 0) throw new Error('No user exists');

  const passwordMatch = await bcrypt.compare(body.password, data[0].password);
  if (!passwordMatch) throw new Error('Invalid Password');

  const token = jwt.sign(
    { id: data[0]._id, email: data[0].email },
    process.env.JWT_SECRET as string,
    { expiresIn: '1h' } // Token expires in 1 hour
  );

  return {
    token,
    firstName: data[0].firstName,
    lastName: data[0].lastName,
  };
};

