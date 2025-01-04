import Note from '../models/note.model';
import { Inote } from '../interfaces/note.interface';
import { Types } from 'mongoose';

export const createNote = async (noteData: Inote): Promise<Inote> => {
  const color = noteData.color || 'white';
  const newNote = await Note.create({ ...noteData, color });
  newNote.createdBy = noteData.createdBy;
  await newNote.save();
  return newNote;
};

export const getAllNotes = async (userId: string,skip: number,limit :number): Promise<{notes: Inote[], totalRecords: number}> => {
  const notes = await Note.find({ createdBy: new Types.ObjectId(userId) })
  .skip(skip).limit(limit);

  if (!notes || notes.length === 0) {
    throw new Error('Notes not found');
  }

  const totalRecords = await Note.countDocuments({createdBy:userId});

  return { notes,totalRecords };
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

export const trashNote = async (noteId: string): Promise<Inote | null> => {
  if (!noteId) {
    throw new Error('Note ID is required');
  }
  const note = await Note.findOne({ _id: noteId });
  if (!note) {
    throw new Error('Note not found');
  }
  note.isTrash = !note.isTrash;
  await note.save();
  return note;
};

export const archiveNote = async (noteId: string): Promise<Inote | null> => {
  if (!noteId) {
    throw new Error('Note ID is required');
  }
  const note = await Note.findOne({
    $and: [{ _id: noteId }, { isTrash: false }],
  });

  if (!note) {
    throw new Error('Note not found');
  }

  note.isArchive = !note.isArchive;
  await note.save();
  return note;
};