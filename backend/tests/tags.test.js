const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const db = require('./db');
const User = require('../models/userModel');
const Tag = require('../models/tagModel');
const Word = require('../models/wordModel');
const TagWord = require('../models/intermediary/tagWordModel');

jest.mock('../utils/sendEmail', () => jest.fn().mockResolvedValue());

beforeAll(() => db.connectDB());
beforeEach(() => db.clearDB());
afterAll(() => db.closeDB());

const registerAndLogin = async () => {
    await request(app).post('/api/users').send({
        name: 'Tag User', email: 'tag@test.com', username: 'taguser', password: 'pass123',
    });
    const r = await request(app).post('/api/users/login').send({ email: 'tag@test.com', password: 'pass123' });
    return r.body;
};

describe('POST /api/tags - Create Tag', () => {
    let token, userId;

    beforeEach(async () => {
        const data = await registerAndLogin();
        token = data.token;
        userId = data._id;
    });

    it('creates a tag without words', async () => {
        const res = await request(app)
            .post('/api/tags').set('Authorization', `Bearer ${token}`)
            .send({ author: userId, label: 'Vocabulary', public: 'Private', words: [] });

        expect(res.statusCode).toBe(200);
        expect(res.body.words).toEqual([]);
    });

    it('creates a tag with word associations', async () => {
        const word = await Word.create({
            user: userId, partOfSpeech: 'Noun',
            translations: [{ language: 'EN', cases: [{ word: 'book', caseName: 'singularNominative' }] }],
        });

        const res = await request(app)
            .post('/api/tags').set('Authorization', `Bearer ${token}`)
            .send({ author: userId, label: 'Nouns', public: 'Private', words: [{ _id: word._id }] });

        expect(res.statusCode).toBe(200);
        const tagWords = await TagWord.find({ tagId: res.body._id });
        expect(tagWords).toHaveLength(1);
    });

    it('fails with 400 when label is missing', async () => {
        const res = await request(app)
            .post('/api/tags').set('Authorization', `Bearer ${token}`)
            .send({ author: userId, public: 'Private', words: [] });
        expect(res.statusCode).toBe(400);
    });

    it('fails with 400 when public status is invalid', async () => {
        const res = await request(app)
            .post('/api/tags').set('Authorization', `Bearer ${token}`)
            .send({ author: userId, label: 'Bad', public: 'Invalid', words: [] });
        expect(res.statusCode).toBe(400);
    });
});

describe('GET /api/tags/getTags - Get User Tags', () => {
    let token, userId;

    beforeEach(async () => {
        const data = await registerAndLogin();
        token = data.token;
        userId = data._id;
        await Tag.create({ author: userId, label: 'First', public: 'Private' });
        await Tag.create({ author: userId, label: 'Second', public: 'Public' });
    });

    it('returns all tags authored by the user', async () => {
        const res = await request(app)
            .get('/api/tags/getTags').set('Authorization', `Bearer ${token}`);
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });
});

describe('DELETE /api/tags/:id - Delete Tag', () => {
    let token, userId, tagId;

    beforeEach(async () => {
        const data = await registerAndLogin();
        token = data.token;
        userId = data._id;

        const word = await Word.create({
            user: userId, partOfSpeech: 'Verb',
            translations: [{ language: 'EN', cases: [{ word: 'go', caseName: 'infinitiveNonFiniteSimpleEN' }] }],
        });
        const tag = await Tag.create({ author: userId, label: 'ToDelete', public: 'Private' });
        tagId = tag._id;
        await TagWord.create({ tagId: tag._id, wordId: word._id });
    });

    it('deletes tag and cleans up TagWord entries', async () => {
        const res = await request(app)
            .delete(`/api/tags/${tagId}`).set('Authorization', `Bearer ${token}`);
        expect(res.statusCode).toBe(200);

        expect(await Tag.findById(tagId)).toBeNull();
        expect(await TagWord.find({ tagId })).toHaveLength(0);
    });

    it('fails with 401 when not the author', async () => {
        await request(app).post('/api/users').send({
            name: 'Other', email: 'other@test.com', username: 'other', password: 'pass123',
        });
        const r = await request(app).post('/api/users/login').send({ email: 'other@test.com', password: 'pass123' });

        const res = await request(app)
            .delete(`/api/tags/${tagId}`).set('Authorization', `Bearer ${r.body.token}`);
        expect(res.statusCode).toBe(401);
    });
});
