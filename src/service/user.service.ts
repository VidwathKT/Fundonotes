import User from '../models/user.model';
import { IUser } from '../interfaces/user.interface';
import bcrypt from 'bcrypt';


export const newUserReg = async (body: IUser): Promise<IUser> => {
  // Check if the email already exists
  const existingUser = await User.findOne({ Email: body.Email }).exec();
  if (existingUser) {
    throw new Error('Email ID already exists');
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(body.Password, 10);
  body.Password = hashedPassword;

  // Create the user in the database
  const data = await User.create(body);
  console.log(data);
  return data;
};


export const userLogin = async (body: any): Promise<any> => {
  const data = await User.findOne({ Email: body.Email }).exec();
  if (!data) throw new Error("No user exists");

  // Check if the password matches
  const passwordMatch = await bcrypt.compare(body.Password, data.Password);
  if (!passwordMatch) throw new Error("Invalid Password");

  // Return user information
  return { message: `${data.Firstname} ${data.Lastname}`};
};

