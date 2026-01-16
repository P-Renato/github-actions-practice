import { describe, test, expect } from 'bun:test';
import request from 'supertest';
import app from '../src/server.js';

describe('MERN API Tests with TypeScript', () => {
  test('GET / should return welcome message', async () => {
    const response = await request(app).get('/');
    
    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toContain('Welcome');
  });

  test('GET /api/health should return OK status with runtime info', async () => {
    const response = await request(app).get('/api/health');
    
    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toHaveProperty('status', 'OK');
    expect(response.body.data).toHaveProperty('runtime', 'Bun');
    expect(response.body.data).toHaveProperty('typescript', true);
  });

  describe('User Creation', () => {
    test('POST /api/users should create a user with valid data', async () => {
      const userData = {
        name: 'Jane Doe',
        email: 'jane@example.com'
      };
      
      const response = await request(app)
        .post('/api/users')
        .send(userData);
      
      expect(response.statusCode).toBe(201);
      expect(response.body.success).toBe(true);
      
      const user = response.body.data;
      expect(user.id).toBeGreaterThan(0);
      expect(user.name).toBe(userData.name);
      expect(user.email).toBe(userData.email);
      expect(user.createdAt).toBeDefined();
    });

    test('POST /api/users should fail without name', async () => {
      const response = await request(app)
        .post('/api/users')
        .send({ email: 'test@example.com' });
      
      expect(response.statusCode).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('required');
    });

    test('POST /api/users should fail without email', async () => {
      const response = await request(app)
        .post('/api/users')
        .send({ name: 'John Doe' });
      
      expect(response.statusCode).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('required');
    });

    test('POST /api/users should fail with invalid email', async () => {
      const response = await request(app)
        .post('/api/users')
        .send({ name: 'John Doe', email: 'invalid-email' });
      
      expect(response.statusCode).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Invalid email');
    });
  });

  test('Should return 404 for non-existent routes', async () => {
    const response = await request(app).get('/non-existent-route');
    
    expect(response.statusCode).toBe(404);
    expect(response.body.success).toBe(false);
    expect(response.body.error).toBe('Route not found');
  });
});
