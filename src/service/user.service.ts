import User from '../models/user.model';
import { IUser,LoginResponse } from '../interfaces/user.interface';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv'
import { sendEmail } from '../utilities/nodeMailer';
import {createJwtToken} from '../utilities/jwtToken';
import jwt from 'jsonwebtoken'

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

    const token = createJwtToken(payload,process.env.JWT_SECRET as string ,'1h');
    const refreshToken = createJwtToken(payload,process.env.JWT_SECRET_REFRESH as string ,'7d');

    await User.findOneAndUpdate({ _id: data[0]._id }, { refreshToken });

  return {
    token,
    refreshToken,
    firstName: data[0].firstName,
    lastName: data[0].lastName,
  };

};

export const forgetPasswordService = async (body: { email: string }): Promise<string> => {
  if (!body.email) {
    throw new Error('Email is required');
  }

  const data = await User.find({ email: body.email });
  if (data.length === 0) throw new Error('No user exists');

  const token = createJwtToken({ email: body.email },process.env.JWT_FORGETSECRET as string,'10m');

  const subject = 'Password Reset Token';
  const message = `Your password reset token is: ${token}`;

  await sendEmail({
    recipients: body.email, // Send to the user's email
    subject: subject,
    message: message,
  });

  return token;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const resetPasswordService = async (body: { email: string; password: string }): Promise<any> => {
  const hashedPassword = await bcrypt.hash(body.password, 10);
  const updatedUser = await User.updateOne({ email: body.email }, { password: hashedPassword });

  if (!updatedUser.matchedCount) {
    throw new Error('User not found or password update failed');
  }

  return updatedUser;
};

export const refreshTokenService = async (body:{createdBy:string; email:string}):Promise<string>=>{
  try{
      const user = await User.findById(body.createdBy);
      const refreshToken = user?.refreshToken;
      if(!refreshToken){
        throw new Error('Refresh token not found in database');
      }
      const secret = process.env.JWT_SECRET_REFRESH
      if (!secret) {
        throw new Error('JWT_SECRET_REFRESH is not defined in .env file');
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const payload:any = jwt.verify(refreshToken, secret);
      const { userId,email }=payload;
      const newAccessToken = createJwtToken({userId,email},process.env.JWT_SECRET as string,'1h');
      return newAccessToken ;
    }
  catch(error){
    throw new Error(`Error ${error}`)
  }
};