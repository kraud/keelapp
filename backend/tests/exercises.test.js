const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const db = require('./db');
const Word = require('../models/wordModel');
const ExercisePerformance = require('../models/exercisePerformanceModel');

jest.mock('../utils/sendEmail', () => jest.fn().mockResolvedValue());

beforeAll(() => db.connectDB());
beforeEach(() => db.clearDB());
afterAll(() => db.closeDB());

const registerAndLogin = async () => {
    await request(app).post('/api/users').send({
        name: 'Ex User', email: 'ex@test.com', username: 'exuser', password: 'pass123',
    });
    const r = await request(app).post('/api/users/login').send({ email: 'ex@test.com', password: 'pass123' });
    return r.body;
};

const seedWords = async (token) => {
    await request(app).post('/api/words').set('Authorization', `Bearer ${token}`)
        .send({
            partOfSpeech: 'Verb',
            translations: [
                { language: 'English', cases: [{ word: 'to run', caseName: 'infinitiveNonFiniteSimpleEN' }] },
                { language: 'Estonian', cases: [{ word: 'jooksma', caseName: 'infinitiveMaEE' }] },
            ],
            tags: [],
        });
    await request(app).post('/api/words').set('Authorization', `Bearer ${token}`)
        .send({
            partOfSpeech: 'Verb',
            translations: [
                { language: 'English', cases: [{ word: 'to eat', caseName: 'infinitiveNonFiniteSimpleEN' }] },
                { language: 'Estonian', cases: [{ word: 's88ma', caseName: 'infinitiveMaEE' }] },
            ],
            tags: [],
        });
};

describe('GET /api/exercises/getUserExercises - Exercise Generation', () => {
    let token, userId;

    beforeEach(async () => {
        const data = await registerAndLogin();
        token = data.token;
        userId = data._id;
        await seedWords(token);
    });

    it('returns exercises for valid parameters (Multi-Language)', async () => {
        const params = encodeURIComponent(JSON.stringify({
            languages: ['English', 'Estonian'],
            partsOfSpeech: ['Verb'],
            amountOfExercises: 1,
            multiLang: 'Multi-Language',
            type: 'Text-Input',
            mode: 'Single-Try',
            wordSelection: 'Random',
        }));

        const res = await request(app)
            .get(`/api/exercises/getUserExercises?parameters=${params}`)
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
    });

    it('returns 200 for Single-Language exercises', async () => {
        const params = encodeURIComponent(JSON.stringify({
            languages: ['English', 'Estonian'],
            partsOfSpeech: ['Verb'],
            amountOfExercises: 1,
            multiLang: 'Single-Language',
            type: 'Text-Input',
            mode: 'Single-Try',
            wordSelection: 'Random',
        }));

        const res = await request(app)
            .get(`/api/exercises/getUserExercises?parameters=${params}`)
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
    });
});

describe('POST /api/exercises/saveTranslationPerformance - Performance Tracking', () => {
    let token, userId;

    beforeEach(async () => {
        const data = await registerAndLogin();
        token = data.token;
        userId = data._id;
        await seedWords(token);
    });

    it('creates a new performance entry on first save', async () => {
        const word = await Word.findOne({});
        const res = await request(app)
            .post('/api/exercises/saveTranslationPerformance')
            .set('Authorization', `Bearer ${token}`)
            .send({
                translationId: new mongoose.Types.ObjectId().toString(),
                translationLanguage: 'Estonian',
                word: word._id.toString(),
                caseName: 'infinitiveMaEE',
                record: true,
            });

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('averageTranslationKnowledge');
        expect(res.body.statsByCase).toHaveLength(1);
    });

    it('updates knowledge on subsequent saves', async () => {
        const word = await Word.findOne({});
        const tid = new mongoose.Types.ObjectId().toString();
        await request(app)
            .post('/api/exercises/saveTranslationPerformance')
            .set('Authorization', `Bearer ${token}`)
            .send({ translationId: tid, translationLanguage: 'Estonian', word: word._id.toString(), caseName: 'infinitiveMaEE', record: true });

        const res = await request(app)
            .post('/api/exercises/saveTranslationPerformance')
            .set('Authorization', `Bearer ${token}`)
            .send({ translationId: tid, translationLanguage: 'Estonian', word: word._id.toString(), caseName: 'infinitiveMaEE', record: true });

        expect(res.statusCode).toBe(200);
        expect(res.body.statsByCase[0].knowledge).toBeGreaterThan(0);
        expect(res.body.statsByCase[0].record).toHaveLength(2);
    });

    it('tracks wrong answers (record: false)', async () => {
        const word = await Word.findOne({});
        const tid = new mongoose.Types.ObjectId().toString();
        const res = await request(app)
            .post('/api/exercises/saveTranslationPerformance')
            .set('Authorization', `Bearer ${token}`)
            .send({ translationId: tid, translationLanguage: 'Estonian', word: word._id.toString(), caseName: 'infinitiveMaEE', record: false });

        expect(res.statusCode).toBe(200);
        expect(res.body.statsByCase[0].record).toEqual([false]);
    });
});

describe('POST /api/exercises/savePerformanceAction - Performance Modifiers', () => {
    let token, userId, performanceId;

    beforeEach(async () => {
        const data = await registerAndLogin();
        token = data.token;
        userId = data._id;

        const word = await Word.create({
            user: userId,
            partOfSpeech: 'Verb',
            translations: [{ language: 'EN', cases: [{ word: 'test', caseName: 'infinitiveNonFiniteSimpleEN' }] }],
        });

        const perf = await ExercisePerformance.create({
            user: userId, translationId: new mongoose.Types.ObjectId(),
            word: word._id, statsByCase: [],
            averageTranslationKnowledge: 50,
            lastDateModifiedTranslation: new Date(),
        });
        performanceId = perf._id.toString();
    });

    it('marks a translation as Mastered', async () => {
        const res = await request(app)
            .post('/api/exercises/savePerformanceAction')
            .set('Authorization', `Bearer ${token}`)
            .send({ performanceId, action: 'master' });

        expect(res.statusCode).toBe(200);
        expect(res.body.performanceModifier).toBe('Mastered');
    });

    it('marks a translation for Revise', async () => {
        const res = await request(app)
            .post('/api/exercises/savePerformanceAction')
            .set('Authorization', `Bearer ${token}`)
            .send({ performanceId, action: 'forget' });

        expect(res.statusCode).toBe(200);
        expect(res.body.performanceModifier).toBe('Revise');
    });
});
