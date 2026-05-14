const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const db = require('./db');
const Tag = require('../models/tagModel');
const Word = require('../models/wordModel');
const User = require('../models/userModel');

jest.mock('../utils/sendEmail', () => jest.fn().mockResolvedValue());

beforeAll(() => db.connectDB());
beforeEach(() => db.clearDB());
afterAll(() => db.closeDB());

const stripDynamic = (obj) => {
    if (Array.isArray(obj)) return obj.map(stripDynamic);
    if (obj && typeof obj === 'object') {
        const cleaned = {};
        for (const [k, v] of Object.entries(obj)) {
            if (['_id', 'id', '__v', 'createdAt', 'updatedAt', 'lastDateModifiedTranslation', 'lastDate', 'user', 'author', 'translationId', 'word', 'originalCreator', '$__', '$isNew', '_doc', '$isValid'].includes(k)) continue;
            cleaned[k] = stripDynamic(v);
        }
        return cleaned;
    }
    return obj;
};

describe('Data Snapshots - Migration Baseline', () => {
    let token, userId;

    beforeEach(async () => {
        const user = await User.create({
            name: 'Snapshot Tester',
            email: 'snap@test.com',
            username: 'snapuser',
            password: '$2a$10$dummyhash',
        });
        userId = user._id.toString();
        token = global.signin(userId);
    });

    it('records the shape of a full Word with 3 languages', async () => {
        const tag = await Tag.create({ author: userId, label: 'Core Verbs', public: 'Private' });

        const res = await request(app)
            .post('/api/words')
            .set('Authorization', `Bearer ${token}`)
            .send({
                partOfSpeech: 'Verb',
                translations: [
                    {
                        language: 'English',
                        cases: [
                            { word: 'to run', caseName: 'infinitiveNonFiniteSimpleEN' },
                            { word: 'run', caseName: 'simplePresent1sEN' },
                            { word: 'ran', caseName: 'simplePastEN' },
                        ],
                    },
                    {
                        language: 'Estonian',
                        cases: [
                            { word: 'jooksma', caseName: 'infinitiveMaEE' },
                            { word: 'jookseb', caseName: 'indicativePresent3sEE' },
                            { word: 'jooksis', caseName: 'indicativePast1sEE' },
                        ],
                    },
                    {
                        language: 'German',
                        cases: [
                            { word: 'laufen', caseName: 'infinitiveDE' },
                            { word: 'laeuft', caseName: 'present3sDE' },
                            { word: 'lief', caseName: 'preterite1s3sDE' },
                        ],
                    },
                ],
                clue: 'move quickly on foot',
                tags: [{ _id: tag._id }],
            });

        expect(res.statusCode).toBe(200);
        expect(stripDynamic(res.body)).toMatchSnapshot();
    });

    it('records the shape of an ExercisePerformance document', async () => {
        const word = await Word.create({
            user: userId,
            partOfSpeech: 'Noun',
            translations: [
                { language: 'EN', cases: [{ word: 'book', caseName: 'singularNominative' }] },
                { language: 'ES', cases: [{ word: 'libro', caseName: 'singularES' }] },
            ],
        });

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
        expect(stripDynamic(res.body)).toMatchSnapshot();
    });

    it('records the shape of a Tag with word associations', async () => {
        const word = await Word.create({
            user: userId,
            partOfSpeech: 'Adjective',
            translations: [
                { language: 'EN', cases: [{ word: 'big', caseName: 'positive' }] },
                { language: 'DE', cases: [{ word: 'groß', caseName: 'positive' }] },
            ],
        });

        const res = await request(app)
            .post('/api/tags')
            .set('Authorization', `Bearer ${token}`)
            .send({
                author: userId,
                label: 'Adjectives Pack',
                public: 'Private',
                description: 'Common adjectives',
                words: [{ _id: word._id }],
            });

        expect(res.statusCode).toBe(200);
        expect(stripDynamic(res.body)).toMatchSnapshot();
    });
});
