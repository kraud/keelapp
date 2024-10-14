const request = require("supertest");
const mongoose = require("mongoose");
const Word = require("../backend/models/wordModel")
const { app , server } = require("../backend/api/index.js");
const { generateRandomId, getRandomOfArray, exampleWords } = require("../tests/testUtils.js");

require("dotenv").config();

let testingWords = [] // words used for this tests
let testingWordsIds = []
beforeAll(async () => {
    try {
        testingWords = await Word.insertMany(exampleWords);
        testingWordsIds = testingWords.map(word => word.id);
    } catch (e) {
        console.log(e);
    }
});

/* Closing database connection after all tests are completed. */
afterAll(async () => {
    if (testingWordsIds.length > 0) {
        await Word.deleteMany({ _id: { $in: testingWordsIds } })
    }
    await mongoose.connection.close();
    server.close();
});

/**
 * Test every endpoint/route related to exercises
 * Endpoints
 *  GET  /getUserExercises   (ExerciseController.js::getExercises)
 *  POST /saveTranslationPerformance (saveTranslationPerformance)
 *  POST /savePerformanceAction ==>  (EsavePerformanceAction)
 */
describe("Exercise's API tests", () => {
    let token // jwt login token

    // Checks every endpoint is protected
    it("GET /getUserExercises - Should failed because of unauthorized request", async () => {
        const response = await request(app).get("/api/exercises/getUserExercises");
        expect(response.statusCode).toBe(401);
    });

    it("POST /saveTranslationPerformance - Should failed because of unauthorized request", async () => {
        const response = await request(app)
            .post("/api/exercises/saveTranslationPerformance")
            .send({});
        expect(response.statusCode).toBe(401);
    });

    it("POST /savePerformanceAction - Should failed because of unauthorized request", async () => {
        const response = await request(app)
            .post("/api/exercises/savePerformanceAction")
            .send({});
        expect(response.statusCode).toBe(401);
    });

    // languages: Lang[],
    // partsOfSpeech: PartOfSpeech[],
    // amountOfExercises: number,
    // multiLang: CardTypeSelection, // 'Multi-Language' | 'Single-Language' | 'Random',
    // type: ExerciseTypeSelection, //  'Multiple-Choice' | 'Text-Input' | 'Random',
    // mode: 'Single-Try' | 'Multiple-Tries'
    // preSelectedWords?: any[] // simple-word data
    // wordSelection: WordSortingSelection // determines if we use exercise-performance info to sort words/translations before selecting exercises
    // nativeLanguage?: Lang

    it("GET /api/exercises/getUserExercises - Should failed without params data", async () => {
        const loginResponse = await request(app).post("/api/users/login").send({
            email: process.env.TEST_EMAIL,
            password: process.env.TEST_PASSWORD,
        });

        token = loginResponse.body.token // saving token for next tests
        expect(token).toBeDefined()

        const response = await request(app)
            .get("/api/exercises/getUserExercises")
            .set({
                Authorization: "Bearer " + token
            })
            .query({});

        expect(response.statusCode).toBe(400);
        expect(response.body).toHaveProperty("message")
    });

    const params1 = {
        languages: ["Spanish","English","German"],
        partsOfSpeech: ["Verb", "Noun"],
        amountOfExercises: 5,
        multiLang: "Random",
        type: "Multiple-Choice",
        mode: "Single-Try",
        wordSelection: "Exercise-Performance",
        difficultyTI: 2
    }

    it("GET /api/exercises/getUserExercises - Should get exercises based on all saved words", async () => {
        expect(token).toBeDefined();

        const response = await request(app)
            .get("/api/exercises/getUserExercises")
            .set({
                Authorization: "Bearer " + token
            })
            .query({parameters: params1});

        expect(response.statusCode).toBe(200)
        expect(response.body.length).toBe(5)

        response.body.forEach(exercise => {
            expect(exercise.wordId).toBeDefined()
            expect(exercise).toHaveProperty('type', "Multiple-Choice") // match params
            expect(exercise).toHaveProperty('knowledge', 0) // because all selected words are new
        });
    });

    const params = {
        languages: ["Spanish","English","German"],
        partsOfSpeech: ["Verb", "Noun"],
        amountOfExercises: 3,
        multiLang: "Random",
        type: "Text-Input",
        mode: "Single-Try",
        preSelectedWords: testingWordsIds,
        wordSelection: "Exercise-Performance",
        difficultyTI: 2
    }

    let exercises
    it("GET /api/exercises/getUserExercises - Should get exercises based on pre selected words", async () => {
        expect(testingWords.length).toBe(3); // amount of examples words
        expect(token).toBeDefined();

        const response = await request(app)
            .get("/api/exercises/getUserExercises")
            .set({
                Authorization: "Bearer " + token
            })
            .query({parameters: params});

        expect(response.statusCode).toBe(200);
        expect(response.body.length).toBe(params.amountOfExercises); // amount of exercises set in params

        exercises = response.body;

        response.body.forEach(exercise => {
            expect(testingWordsIds).toContain(exercise.wordId) //check every exercise is based on preSelectedWords
            expect(exercise).toHaveProperty('type', params.type) // match params
            expect(exercise).toHaveProperty('knowledge', 0) // because all selected words are new
        });
    });


    it("POST /api/exercises/saveTranslationPerformance - Should failed with empty parameters", async () => {
        expect(exercises).toBeDefined();

        const response = await request(app)
            .post("/api/exercises/saveTranslationPerformance")
            .set({
                Authorization: "Bearer " + token
            })
            .send({});

        expect(response.statusCode).toBe(200);
    });

});