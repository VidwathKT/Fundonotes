import Note from '../models/note.model';
import { Inote } from '../interfaces/note.interface';
import { SortOrder, Types } from 'mongoose';
import redisClient from '../config/redis'

export const createNote = async (noteData: Inote): Promise<Inote> => {
  const color = noteData.color || 'white';
  const newNote = await Note.create({ ...noteData, color });
  newNote.createdBy = noteData.createdBy;
  await newNote.save();
  await redisClient.del(`notes:${noteData.createdBy}`)
  return newNote;
};

export const getAllNotes = async (userId: string,skip: number,limit :number): Promise<{notes: Inote[], totalRecords: number}> => {
  const notes = await Note.find({ createdBy: new Types.ObjectId(userId) })
  .skip(skip).limit(limit);

  if (!notes || notes.length === 0) {
    throw new Error('Notes not found');
  }

  const totalRecords = await Note.countDocuments({createdBy:userId});
  await redisClient.setEx(`notes:${userId}`, 3600, JSON.stringify(notes));

  return { notes,totalRecords };
};

export const getNote = async (noteId: string,userId:string): Promise<Inote | null> => {
  const note = await Note.findOne({
    $and: [
      { _id: new Types.ObjectId(noteId) },
      { isTrash: false },
      { isArchive: false },],
  });
  await redisClient.setEx(`note:${userId}:${noteId}`, 3600, JSON.stringify(note));
  return note;
};

export const updateNote = async (noteId: string, noteData: Partial<Inote>): Promise<Inote | null> => {
  const updatedNote = await Note.findOneAndUpdate(
    {
      $and: [{ _id: new Types.ObjectId(noteId) },{ isTrash: false },{ isArchive: false },],
    },noteData,{ new: true });

  if (!updatedNote) {
    throw new Error('Note not found');
  }
  await redisClient.del(updatedNote.createdBy.toString());

  return updatedNote;
};


export const permanentlyDeleteNote = async (noteId: string,userId:string): Promise<void> => {
  const result = await Note.deleteOne({
    _id: new Types.ObjectId(noteId),
    isTrash: true,
  });

  if (result.deletedCount === 0) {
    throw new Error('Note not found or not in trash');
  }
  await redisClient.del(`notes:${userId}`);
  await redisClient.del(`note:${userId}:${noteId}`);
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
  await redisClient.del(`notes:${note.createdBy.toString()}`)
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
  await redisClient.del(note.createdBy.toString());
  return note;
};

export const search = async (search: string, page: number, limit: number, sortOrder: string): Promise<{ results: Inote[] }> => {
  try {
      const sortQuery: { [key: string]: SortOrder } = { title: sortOrder === 'asc' ? 1 : -1 };

      const searchResult: Inote [] = await Note.find({
          $or: [
              { title: { $regex: search, $options: 'i' } },
              { description: { $regex: search, $options: 'i' } },
          ],
      })
      .sort(sortQuery)
      .skip((page - 1) * limit)
      .limit(limit);

      if (searchResult.length === 0) {
          throw new Error('No results found');
      }

      return { results: searchResult };
  }
  catch (error) {
    if (error instanceof Error) {
      throw new Error(`Error performing search: ${error.message}`);
  } else {
      throw new Error('An unknown error occurred');
  }
  }
};