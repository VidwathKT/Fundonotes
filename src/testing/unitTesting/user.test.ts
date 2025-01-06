/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-undef */
import * as userService from '../../service/user.service';
import * as noteService from '../../service/note.service';
import User from '../../models/user.model';
import Note from '../../models/note.model';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';


jest.mock('../../models/user.model');
jest.mock('../../models/note.model');
jest.mock('bcrypt');
jest.mock('jsonwebtoken');
jest.mock('../../utilities/nodeMailer');

describe('User Service', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should register a new user', async () => {
    const mockUser = {
      _id: 'userId',
      firstName: 'John',
      lastName: 'Doe',
      email: 'test@example.com',
      password: '12345',
    };

    const hashedPassword = 'hashed_password';
    const createdUser = { ...mockUser, password: hashedPassword };

    (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);
    (User.findOne as jest.Mock).mockResolvedValue(null);
    (User.create as jest.Mock).mockResolvedValue(createdUser);

    const result = await userService.newUserReg(mockUser as any); // Use `as any` to bypass strict type checks in mock
    expect(result).toEqual(createdUser);
    expect(bcrypt.hash).toHaveBeenCalledWith(mockUser.password, 10);
    expect(User.create).toHaveBeenCalledWith(expect.objectContaining(mockUser));
  });

  test('should login a user and return tokens', async () => {
    const mockBody = { email: 'test@example.com', password: '12345' };
    const mockUser = {
      _id: 'userId',
      email: 'test@example.com',
      password: 'hashed_password',
      firstName: 'John',
      lastName: 'Doe',
    };

    const mockToken = 'mockToken';
    const mockRefreshToken = 'mockRefreshToken';

    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    (jwt.sign as jest.Mock).mockReturnValueOnce(mockToken).mockReturnValueOnce(mockRefreshToken);
    (User.find as jest.Mock).mockResolvedValue([mockUser]);

    const result = await userService.userLogin(mockBody);
    expect(result).toEqual({
      token: mockToken,
      refreshToken: mockRefreshToken,
      firstName: mockUser.firstName,
      lastName: mockUser.lastName,
    });
    expect(bcrypt.compare).toHaveBeenCalledWith(mockBody.password, mockUser.password);
  });

  test('should throw an error for invalid login credentials', async () => {
    const mockBody = { email: 'test@example.com', password: 'wrongpassword' };
    const mockUser = { email: 'test@example.com', password: 'hashed_password' };

    (bcrypt.compare as jest.Mock).mockResolvedValue(false);
    (User.find as jest.Mock).mockResolvedValue([mockUser]);

    await expect(userService.userLogin(mockBody)).rejects.toThrow('Invalid Password');
  });
});

describe('Notes Service', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should create a note', async () => {
    const mockNote = {
      _id: 'noteId',
      title: 'Note Title',
      content: 'Note Content',
      createdBy: 'userId',
      color: 'white',
    };

    (Note.create as jest.Mock).mockResolvedValueOnce(mockNote);

    const result = await noteService.createNote(mockNote as any); // Use `as any` to bypass strict type checks in mock
    expect(result).toEqual(mockNote);
    expect(Note.create).toHaveBeenCalledWith(expect.objectContaining(mockNote));
  });

  test('should get all notes with pagination', async () => {
    const mockUserId = 'userId';
    const mockNotes = [
      { _id: '1', title: 'Note 1', content: 'Content 1', createdBy: mockUserId },
      { _id: '2', title: 'Note 2', content: 'Content 2', createdBy: mockUserId },
    ];

    const totalRecords = 2;
    (Note.find as jest.Mock).mockResolvedValueOnce(mockNotes);
    (Note.countDocuments as jest.Mock).mockResolvedValueOnce(totalRecords);

    const result = await noteService.getAllNotes(mockUserId, 0, 5);

    expect(result).toEqual({
      notes: mockNotes,
      totalRecords,
    });
    expect(Note.find).toHaveBeenCalledWith({ createdBy: expect.any(Object) });
    expect(Note.countDocuments).toHaveBeenCalledWith({ createdBy: mockUserId });
  });

  test('should update a note', async () => {
    const mockNoteId = 'noteId';
    const mockUpdateData = { title: 'Updated Title' };
    const updatedNote = { ...mockUpdateData, _id: mockNoteId };

    (Note.findOneAndUpdate as jest.Mock).mockResolvedValueOnce(updatedNote);

    const result = await noteService.updateNote(mockNoteId, mockUpdateData);
    expect(result).toEqual(updatedNote);
    expect(Note.findOneAndUpdate).toHaveBeenCalledWith(
      expect.any(Object),
      mockUpdateData,
      { new: true }
    );
  });

  test('should delete a note permanently', async () => {
    const mockNoteId = 'noteId';
    const deleteResult = { deletedCount: 1 };

    (Note.deleteOne as jest.Mock).mockResolvedValueOnce(deleteResult);

    await noteService.permanentlyDeleteNote(mockNoteId);
    expect(Note.deleteOne).toHaveBeenCalledWith({
      _id: expect.any(Object),
      isTrash: true,
    });
  });
});