import { Schema, model} from 'mongoose';
import { Inote } from '../interfaces/note.interface';


const noteSchema = new Schema<Inote>(
  {
    title:{type: String},
    description: {type: String},
    color: {type: String,default: '#FFFFFF' },
    isArchive: {type: Boolean,default:false},
    isTrash: {type: Boolean,default:false},
    createdBy: { type: Schema.Types.ObjectId, ref: 'User',optional:true },
  },
  {
    timestamps: true,
  }
);


export default model('Note', noteSchema);