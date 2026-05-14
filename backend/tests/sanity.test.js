const request = require('supertest');
const app = require('../app');
const db = require('./db');

beforeAll(() => db.connectDB());
afterAll(() => db.closeDB());

describe('Sanity Check', () => {
    it('app is defined', () => {
        expect(app).toBeDefined();
    });

    it('GET / responds with 200 and hello message', async () => {
        const res = await request(app).get('/');
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('message', 'Hello world!');
    });

    it('signin helper generates a valid JWT', () => {
        const token = global.signin('abc123');
        expect(token).toBeDefined();
        expect(typeof token).toBe('string');
        expect(token.split('.')).toHaveLength(3);
    });

    it('MongoDB Memory Server is connected', () => {
        const mongoose = require('mongoose');
        expect(mongoose.connection.readyState).toBe(1);
    });
});
