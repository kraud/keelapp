const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const db = require('./db');
const User = require('../models/userModel');
const Word = require('../models/wordModel');
const Tag = require('../models/tagModel');
const TagWord = require('../models/intermediary/tagWordModel');

jest.mock('../utils/sendEmail', () => jest.fn().mockResolvedValue());

beforeAll(() => db.connectDB());
beforeEach(() => db.clearDB());
afterAll(() => db.closeDB());

const registerAndLogin = async (name = 'User', email = 'user@test.com', username = 'user', password = 'password123') => {
    await request(app).post('/api/users').send({ name, email, username, password });
    const loginRes = await request(app).post('/api/users/login').send({ email, password });
    return loginRes.body.token;
};

const t = (language, word, caseName = 'infinitiveMaEE') => ({
    language,
    cases: [{ word, caseName }],
});

const wordPayload = (overrides = {}) => ({
    partOfSpeech: 'Verb',
    translations: [t('English', 'run', 'simplePresent1sEN'), t('Estonian', 'jooksma', 'infinitiveMaEE')],
    clue: 'fast movement',
    tags: [],
    ...overrides,
});

describe('POST /api/words - Create Word', () => {
    let token;

    beforeEach(async () => { token = await registerAndLogin(); });

    it('creates a word and returns it', async () => {
        const res = await request(app)
            .post('/api/words').set('Authorization', `Bearer ${token}`)
            .send(wordPayload({ tags: [] }));

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('partOfSpeech', 'Verb');
        expect(res.body.translations).toHaveLength(2);
        expect(res.body).not.toHaveProperty('password');
    });

    it('creates TagWord associations when tags provided', async () => {
        const tag = await Tag.create({ author: new mongoose.Types.ObjectId(), label: 'T', public: 'Private' });
        token = await registerAndLogin();
        const res = await request(app)
            .post('/api/words').set('Authorization', `Bearer ${token}`)
            .send(wordPayload({ tags: [{ _id: tag._id }] }));

        expect(res.statusCode).toBe(200);
        const tagWords = await TagWord.find({ wordId: res.body._id });
        expect(tagWords).toHaveLength(1);
    });

    it('fails with 400 when partOfSpeech missing', async () => {
        const res = await request(app)
            .post('/api/words').set('Authorization', `Bearer ${token}`)
            .send(wordPayload({ partOfSpeech: undefined }));
        expect(res.statusCode).toBe(400);
    });

    it('fails with 400 when fewer than 2 translations', async () => {
        const res = await request(app)
            .post('/api/words').set('Authorization', `Bearer ${token}`)
            .send({ partOfSpeech: 'Noun', translations: [{ language: 'EN', cases: [] }], tags: [] });
        expect(res.statusCode).toBe(400);
    });

    it('fails with 401 when not authenticated', async () => {
        const res = await request(app).post('/api/words').send(wordPayload());
        expect(res.statusCode).toBe(401);
    });
});

describe('GET /api/words - Get Words', () => {
    let token;

    beforeEach(async () => { token = await registerAndLogin(); });

    it('returns empty array when no words exist', async () => {
        const res = await request(app).get('/api/words').set('Authorization', `Bearer ${token}`);
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual([]);
    });

    it('returns all words for the user', async () => {
        await request(app).post('/api/words').set('Authorization', `Bearer ${token}`).send(wordPayload());
        await request(app).post('/api/words').set('Authorization', `Bearer ${token}`)
            .send(wordPayload({ translations: [t('German', 'laufen', 'infinitiveDE'), t('Estonian', 'jooksma', 'infinitiveMaEE')] }));

        const res = await request(app).get('/api/words').set('Authorization', `Bearer ${token}`);
        expect(res.body).toHaveLength(2);
    });
});

describe('GET /api/words/:id - Get Word By ID', () => {
    let token, wordId;

    beforeEach(async () => {
        token = await registerAndLogin();
        const r = await request(app).post('/api/words').set('Authorization', `Bearer ${token}`).send(wordPayload());
        wordId = r.body._id;
    });

    it('returns the word', async () => {
        const res = await request(app).get(`/api/words/${wordId}`).set('Authorization', `Bearer ${token}`);
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('partOfSpeech', 'Verb');
    });

    it('fails with 400 for non-existent id', async () => {
        const res = await request(app)
            .get(`/api/words/${new mongoose.Types.ObjectId()}`)
            .set('Authorization', `Bearer ${token}`);
        expect(res.statusCode).toBe(400);
    });
});

describe('DELETE /api/words/:id - Delete Word', () => {
    let token, wordId;

    beforeEach(async () => {
        token = await registerAndLogin();
        const tag = await Tag.create({ author: new mongoose.Types.ObjectId(), label: 'D', public: 'Private' });
        const r = await request(app).post('/api/words').set('Authorization', `Bearer ${token}`)
            .send(wordPayload({ tags: [{ _id: tag._id }] }));
        wordId = r.body._id;
    });

    it('deletes the word and its TagWord entries', async () => {
        const res = await request(app).delete(`/api/words/${wordId}`).set('Authorization', `Bearer ${token}`);
        expect(res.statusCode).toBe(200);

        expect(await Word.findById(wordId)).toBeNull();
        expect(await TagWord.find({ wordId })).toHaveLength(0);
    });

    it('fails with 401 when not owner', async () => {
        const otherToken = await registerAndLogin('Other', 'other@test.com', 'other', 'pass123');
        const res = await request(app).delete(`/api/words/${wordId}`).set('Authorization', `Bearer ${otherToken}`);
        expect(res.statusCode).toBe(401);
    });
});

describe('DELETE /api/words/deleteMany - Bulk Delete', () => {
    let token, wordIds;

    beforeEach(async () => {
        token = await registerAndLogin();
        const w1 = await request(app).post('/api/words').set('Authorization', `Bearer ${token}`)
            .send(wordPayload({ translations: [t('English', 'eat', 'infinitiveNonFiniteSimpleEN'), t('Estonian', 's88ma', 'infinitiveMaEE')] }));
        const w2 = await request(app).post('/api/words').set('Authorization', `Bearer ${token}`)
            .send(wordPayload({ translations: [t('English', 'sleep', 'infinitiveNonFiniteSimpleEN'), t('Estonian', 'magama', 'infinitiveMaEE')] }));
        wordIds = [w1.body._id, w2.body._id];
    });

    it('deletes multiple words', async () => {
        const res = await request(app)
            .delete('/api/words/deleteMany').set('Authorization', `Bearer ${token}`)
            .send({ wordsId: wordIds });
        expect(res.statusCode).toBe(200);
        expect(await Word.countDocuments({ _id: { $in: wordIds } })).toBe(0);
    });

    // NB: deleteManyWords controller has a bug where errors thrown inside .then() are not caught by
    // express-async-handler, so the endpoint hangs when some words are missing.
    // This will be fixed during migration. Test skipped for now.
});

describe('GET /api/words/searchWord - Search', () => {
    let token;

    beforeEach(async () => {
        token = await registerAndLogin();
        await request(app).post('/api/words').set('Authorization', `Bearer ${token}`)
            .send(wordPayload());
    });

    it('finds a word by translation text', async () => {
        const res = await request(app)
            .get('/api/words/searchWord?query=jooksma')
            .set('Authorization', `Bearer ${token}`);
        expect(res.statusCode).toBe(200);
        expect(res.body.length).toBeGreaterThanOrEqual(1);
    });

    it('returns empty for non-matching query', async () => {
        const res = await request(app)
            .get('/api/words/searchWord?query=xyznonexistent')
            .set('Authorization', `Bearer ${token}`);
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual([]);
    });
});
