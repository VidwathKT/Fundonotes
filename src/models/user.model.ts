import { Schema, model } from 'mongoose';
import { IUser } from '../interfaces/user.interface';


const userSchema = new Schema(
  {
    firstName: {
      type: String, require:true
    },
    lastName:{
      type:String,require:true
    },
    email:{
      type:String,require:true,unique:true
    },
    password:{
      type:String,require:true
    },
    refreshToken: {
      type: String,
      default: null,
      required: false,
    },
  },
  {
    timestamps: true
  }
);

export default model<IUser>('User', userSchema);