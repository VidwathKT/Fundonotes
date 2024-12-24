import User from '../models/user.model';
import { IUser } from '../interfaces/user.interface';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';


export const newUserReg = async (body: IUser): Promise<IUser> => {
  const existingUser = await User.findOne({ Email: body.Email }).exec();
  if (existingUser) {
    throw new Error('Email ID already exists');
  }

  const hashedPassword = await bcrypt.hash(body.Password, 10);
  body.Password = hashedPassword;

  const data = await User.create(body);
  console.log(data);
  return data;
};


export const userLogin = async (body: { Email: string; Password: string }): Promise<any> => {
  const data = await User.find({ Email: body.Email });
  if (data.length === 0) throw new Error('No user exists');

  const passwordMatch = await bcrypt.compare(body.Password, data[0].Password);
  if (!passwordMatch) throw new Error('Invalid Password');

  const token = jwt.sign(
    { id: data[0]._id, email: data[0].Email },
    process.env.JWT_SECRET as string,
    { expiresIn: '1h' } // Token expires in 1 hour
  );

  return {
    token,
    Firstname: data[0].Firstname,
    Lastname: data[0].Lastname,
  };
};

