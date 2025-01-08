/* eslint-disable no-undef */
import request from 'supertest';
import { app } from '../../index';
import { db } from '../../config/DB.config';
import mongoose from 'mongoose';
describe('User Routes', () => {

  beforeAll(async () => {
    await db;
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it('should register a new user', async () => {
    const newUser = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      password: 'password123',
    };

    const response = await request(app)
      .post('/api/v1/users/register') // Replace with your route
      .send(newUser);

    expect(response.status).toBe(201);
    expect(response.body.code).toBe(201);
    expect(response.body.message).toBe('John Doe registered successfully!');
    expect(response.body.data).toHaveProperty('firstName', 'John');
    expect(response.body.data).toHaveProperty('lastName', 'Doe');
  });

  it('should login a user successfully', async () => {
    const loginCredentials = {
      email: 'john.doe@example.com',
      password: 'password123',
    };

    const response = await request(app)
      .post('/api/v1/users/login') // Replace with your route
      .send(loginCredentials);

    expect(response.status).toBe(200);
    expect(response.body.code).toBe(200);
    expect(response.body.message).toBe('John Doe login Successful!');
    expect(response.body).toHaveProperty('token');
    expect(response.body).toHaveProperty('refreshToken');
  });

  it('should return 400 for invalid login credentials', async () => {
    const invalidLogin = {
      email: 'invalid@example.com',
      password: 'wrongpassword',
    };

    const response = await request(app)
      .post('/api/v1/users/login') // Replace with your route
      .send(invalidLogin);

    expect(response.status).toBe(400);
    expect(response.body.code).toBe(400);
    expect(response.body.message).toBe('Invalid credentials');
  });

});

describe('Note Routes', () => {

  let token: string;

  beforeAll(async () => {
    // Register a user to obtain a token for authentication
    const newUser = {
      firstName: 'Alice',
      lastName: 'Smith',
      email: 'alice.smith@example.com',
      password: 'password123',
    };

    const userResponse = await request(app)
      .post('/api/v1/users/register')
      .send(newUser);

    token = userResponse.body.token;
  });

  it('should create a new note', async () => {
    const newNote = {
      title: 'Test Note',
      description: 'This is a test note',
      color: 'blue',
    };

    const response = await request(app)
      .post('/api/v1/notes') // Replace with your route
      .set('Authorization', `Bearer ${token}`)
      .send(newNote);

    expect(response.status).toBe(201);
    expect(response.body.code).toBe(201);
    expect(response.body.message).toBe('Note created successfully');
    expect(response.body.data).toHaveProperty('title', 'Test Note');
    expect(response.body.data).toHaveProperty('description', 'This is a test note');
  });

  it('should fetch all notes', async () => {
    const response = await request(app)
      .get('/api/v1/notes') // Replace with your route
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.code).toBe(200);
    expect(response.body.data).toBeInstanceOf(Array);
  });

  it('should return 401 for unauthorized access to notes', async () => {
    const response = await request(app)
      .get('/api/v1/notes') // Replace with your route
      .set('Authorization', 'Bearer invalidtoken');

    expect(response.status).toBe(401);
    expect(response.body.code).toBe(401);
    expect(response.body.message).toBe('Unauthorized');
  });

});

