const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const db = require('./db');
const User = require('../models/userModel');
const Token = require('../models/tokenModel');

jest.mock('../utils/sendEmail', () => jest.fn().mockResolvedValue());

beforeAll(() => db.connectDB());
beforeEach(() => db.clearDB());
afterAll(() => db.closeDB());

const validUser = {
    name: 'Test User',
    email: 'test@example.com',
    username: 'testuser',
    password: 'password123',
};

const registerUser = (overrides = {}) =>
    request(app).post('/api/users').send({ ...validUser, ...overrides });

describe('POST /api/users - Registration', () => {
    it('registers a new user and returns user data without password', async () => {
        const res = await registerUser();

        expect(res.statusCode).toBe(201);
        expect(res.body).toMatchObject({
            email: 'test@example.com',
            languages: [],
            name: 'Test User',
            nativeLanguage: null,
            uiLanguage: 'English',
            username: 'testuser',
            verified: false,
        });
        expect(res.body._id).toBeDefined();
        expect(res.body).not.toHaveProperty('password');
        expect(res.body).not.toHaveProperty('token');
    });

    it('creates a Token document for email verification', async () => {
        await registerUser();

        const user = await User.findOne({ email: 'test@example.com' });
        const token = await Token.findOne({ userId: user._id });
        expect(token).toBeDefined();
        expect(token.token).toBeDefined();
    });

    it('hashes the password', async () => {
        await registerUser();

        const user = await User.findOne({ email: 'test@example.com' });
        expect(user.password).not.toBe('password123');
    });

    it('fails with 400 when name is missing', async () => {
        const res = await registerUser({ name: undefined });
        expect(res.statusCode).toBe(400);
    });

    it('fails with 400 when email is missing', async () => {
        const res = await registerUser({ email: undefined });
        expect(res.statusCode).toBe(400);
    });

    it('fails with 400 when username is missing', async () => {
        const res = await registerUser({ username: undefined });
        expect(res.statusCode).toBe(400);
    });

    it('fails with 400 when password is missing', async () => {
        const res = await registerUser({ password: undefined });
        expect(res.statusCode).toBe(400);
    });

  // Native language is not yet specified on login but we send empty list [] - not undefined
  //   it('fails with 400 when languages is missing', async () => {
  //       const res = await registerUser({ languages: undefined });
  //       expect(res.statusCode).toBe(400);
  //   });
  // // Native language is not yet specified on login but we send null - not undefined
  //   it('fails with 400 when nativeLanguage is missing', async () => {
  //       const res = await registerUser({ nativeLanguage: undefined });
  //       expect(res.statusCode).toBe(400);
  //   });
  //   it('fails with 400 when uiLanguage is missing', async () => {
  //       const res = await registerUser({ uiLanguage: undefined });
  //       expect(res.statusCode).toBe(400);
  //   });

    it('fails with 400 for duplicate email (case-insensitive)', async () => {
        await registerUser();
        const res = await registerUser({
            email: 'TEST@example.com',
            username: 'otheruser',
        });
        expect(res.statusCode).toBe(400);
    });

    it('fails with 400 for duplicate username (case-insensitive)', async () => {
        await registerUser();
        const res = await registerUser({
            username: 'TestUser',
            email: 'other@example.com',
        });
        expect(res.statusCode).toBe(400);
    });
});

describe('GET /api/users/:id/verify/:token - Email Verification', () => {
    it('verifies the user and returns a JWT', async () => {
        await registerUser();
        const user = await User.findOne({ email: 'test@example.com' });
        const tokenDoc = await Token.findOne({ userId: user._id });

        const res = await request(app).get(
            `/api/users/${user._id}/verify/${tokenDoc.token}`
        );

        expect(res.statusCode).toBe(200);
        expect(res.body.user.token).toBeDefined();

        const updated = await User.findById(user._id);
        expect(updated.verified).toBe(true);
    });

    it('fails with invalid token', async () => {
        await registerUser();
        const user = await User.findOne({ email: 'test@example.com' });

        const res = await request(app).get(
            `/api/users/${user._id}/verify/invalidtoken123`
        );

        expect(res.statusCode).toBe(400);
        expect(res.body.message).toMatch(/invalid link/i);
    });

    it('deletes the Token document after successful verification', async () => {
        await registerUser();
        const user = await User.findOne({ email: 'test@example.com' });
        const tokenDoc = await Token.findOne({ userId: user._id });

        await request(app).get(
            `/api/users/${user._id}/verify/${tokenDoc.token}`
        );

        const remaining = await Token.findOne({ userId: user._id });
        expect(remaining).toBeNull();
    });
});

describe('POST /api/users/login - Login', () => {
    beforeEach(async () => {
        await registerUser();
    });

    it('logs in with valid credentials', async () => {
        const res = await request(app)
            .post('/api/users/login')
            .send({ email: 'test@example.com', password: 'password123' });

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('token');
        expect(res.body).toHaveProperty('name', 'Test User');
        expect(res.body).toHaveProperty('email', 'test@example.com');
        expect(res.body).toHaveProperty('username', 'testuser');
    });

    it('fails with wrong password', async () => {
        const res = await request(app)
            .post('/api/users/login')
            .send({ email: 'test@example.com', password: 'wrongpassword' });

        expect(res.statusCode).toBe(400);
    });

    it('fails with non-existent email', async () => {
        const res = await request(app)
            .post('/api/users/login')
            .send({ email: 'nonexistent@example.com', password: 'password123' });

        expect(res.statusCode).toBe(400);
    });

    it('fails with missing password', async () => {
        const res = await request(app)
            .post('/api/users/login')
            .send({ email: 'test@example.com' });

        expect(res.body).toHaveProperty('message');
        expect(res.body.message).toBeTruthy();
    });
});

describe('GET /api/users/me - Profile', () => {
    let token;

    beforeEach(async () => {
        await registerUser();
        const loginRes = await request(app)
            .post('/api/users/login')
            .send({ email: 'test@example.com', password: 'password123' });
        token = loginRes.body.token;
    });

    it('returns the authenticated user profile', async () => {
        const res = await request(app)
            .get('/api/users/me')
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('email', 'test@example.com');
        expect(res.body).toHaveProperty('name', 'Test User');
        expect(res.body).not.toHaveProperty('password');
    });

    it('fails with 401 when no token is provided', async () => {
        const res = await request(app).get('/api/users/me');

        expect(res.statusCode).toBe(401);
    });

    it('fails with 401 when an invalid token is provided', async () => {
        const res = await request(app)
            .get('/api/users/me')
            .set('Authorization', 'Bearer invalidtoken123');

        expect(res.statusCode).toBe(401);
    });

    it('fails with 401 when Authorization header has no Bearer prefix', async () => {
        const res = await request(app)
            .get('/api/users/me')
            .set('Authorization', token);

        expect(res.statusCode).toBe(401);
    });
});

describe('PUT /api/users/updateUser - Update Profile', () => {
    let token;
    let userId;

    beforeEach(async () => {
        await registerUser();
        const loginRes = await request(app)
            .post('/api/users/login')
            .send({ email: 'test@example.com', password: 'password123' });
        token = loginRes.body.token;
        userId = loginRes.body._id;
    });

    it('updates the name', async () => {
        const res = await request(app)
            .put('/api/users/updateUser')
            .set('Authorization', `Bearer ${token}`)
            .send({
                email: 'test@example.com',
                name: 'Updated Name',
                username: 'testuser',
            });

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('name', 'Updated Name');
    });

    it('fails when username is taken by another user', async () => {
        await registerUser({
            name: 'Other User',
            email: 'other@example.com',
            username: 'otheruser',
            password: 'password123',
        });

        const res = await request(app)
            .put('/api/users/updateUser')
            .set('Authorization', `Bearer ${token}`)
            .send({
                email: 'test@example.com',
                name: 'Test User',
                username: 'otheruser',
            });

        expect(res.statusCode).toBe(400);
    });

    it('fails with 401 when not authenticated', async () => {
        const res = await request(app)
            .put('/api/users/updateUser')
            .send({
                email: 'test@example.com',
                name: 'Updated Name',
                username: 'testuser',
            });

        expect(res.statusCode).toBe(401);
    });
});

describe('Password Reset Flow', () => {
    beforeEach(async () => {
        await registerUser();
    });

    it('POST /api/users/requestPasswordReset returns 200', async () => {
        const res = await request(app)
            .post('/api/users/requestPasswordReset')
            .send({ email: 'test@example.com' });

        expect(res.statusCode).toBe(200);
    });

    it('stores a token in user.passwordTokens', async () => {
        await request(app)
            .post('/api/users/requestPasswordReset')
            .send({ email: 'test@example.com' });

        const user = await User.findOne({ email: 'test@example.com' });
        expect(user.passwordTokens.length).toBe(1);
    });

    it('fails when email is not registered', async () => {
        const res = await request(app)
            .post('/api/users/requestPasswordReset')
            .send({ email: 'unknown@example.com' });

        expect(res.statusCode).toBe(400);
    });

    describe('PUT /api/users/updatePassword', () => {
        let user;

        beforeEach(async () => {
            await request(app)
                .post('/api/users/requestPasswordReset')
                .send({ email: 'test@example.com' });
            user = await User.findOne({ email: 'test@example.com' });
        });

        it('updates the password with valid token', async () => {
            const token = user.passwordTokens[0];

            const res = await request(app)
                .put('/api/users/updatePassword')
                .send({
                    userId: user._id.toString(),
                    password: 'newpassword456',
                    token,
                });

            expect(res.statusCode).toBe(200);

            const loginRes = await request(app)
                .post('/api/users/login')
                .send({ email: 'test@example.com', password: 'newpassword456' });
            expect(loginRes.statusCode).toBe(200);
        });

        it('clears passwordTokens after update', async () => {
            const token = user.passwordTokens[0];

            await request(app)
                .put('/api/users/updatePassword')
                .send({
                    userId: user._id.toString(),
                    password: 'newpassword456',
                    token,
                });

            const updated = await User.findOne({ email: 'test@example.com' });
            expect(updated.passwordTokens).toEqual([]);
        });

        it('fails with invalid token', async () => {
            const res = await request(app)
                .put('/api/users/updatePassword')
                .send({
                    userId: user._id.toString(),
                    password: 'newpassword456',
                    token: 'invalidtoken',
                });

            expect(res.statusCode).toBe(400);
        });

        it('fails with invalid userId', async () => {
            const res = await request(app)
                .put('/api/users/updatePassword')
                .send({
                    userId: new mongoose.Types.ObjectId().toString(),
                    password: 'newpassword456',
                    token: user.passwordTokens[0],
                });

            expect(res.statusCode).toBe(400);
        });
    });
});
