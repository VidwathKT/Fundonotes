import Note from '../models/note.model';
import { Inote } from '../interfaces/note.interface';
import { Types } from 'mongoose';

export const createNote = async (noteData: any): Promise<Inote> => {
  const color = noteData.color || 'white';
  const newNote = await Note.create({ ...noteData, color });
  newNote.createdBy = noteData.createdBy;
  await newNote.save();
  return newNote;
};

export const getAllNotes = async (userId: string): Promise<Inote[]> => {
  const notes = await Note.find({ createdBy: new Types.ObjectId(userId) });
  if (!notes || notes.length === 0) {
    throw new Error('Notes not found');
  }
  return notes;
};


export const getNote = async (noteId: string): Promise<Inote | null> => {
  const note = await Note.findOne({
    $and: [
      { _id: new Types.ObjectId(noteId) },
      { isTrash: false },
      { isArchive: false },],
  });
  return note;
};


export const updateNote = async (noteId: string, noteData: Partial<Inote>): Promise<Inote | null> => {
  const updatedNote = await Note.findOneAndUpdate(
    {
      $and: [
        { _id: new Types.ObjectId(noteId) },
        { isTrash: false },
        { isArchive: false },
      ],
    },
    noteData,
    { new: true }
  );

  if (!updatedNote) {
    throw new Error('Note not found');
  }
  return updatedNote;
};

export const permanentlyDeleteNote = async (noteId: string): Promise<void> => {
  const result = await Note.deleteOne({
    _id: new Types.ObjectId(noteId),
    isTrash: true,
  });

  if (result.deletedCount === 0) {
    throw new Error('Note not found or not in trash');
  }
};
