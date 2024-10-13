const mongoose = require("mongoose");
const request = require("supertest");

const { app , server } = require("../backend/api/index.js");

require("dotenv").config();

const BE_URL = process.env.REACT_APP_VERCEL_BE_URL
const API_URL = (BE_URL !== undefined) ? `${BE_URL}/api/exercises` : '/api/exercises'

console.log("logging in with", process.env.TEST_EMAIL, process.env.TEST_PASSWORD)


function getRandomOfArray(arr) {
    const randomIndex = Math.floor(Math.random() * arr.length);
    return arr[randomIndex];
}

function generateRandomId() {
    const chars = '0123456789abcdef';
    let randomId = '';
    for (let i = 0; i < 24; i++) {
        randomId += chars[Math.floor(Math.random() * chars.length)];
    }
    return randomId;
}

const newWordData =
{
    "clue": "Persons in the cars movies are.. ",
    "partOfSpeech": "Noun",
    "translations": [
        {
            "cases": [
                {
                    "caseName": "regularityES",
                    "word": "regular"
                },
                {
                    "caseName": "singularES",
                    "word": "auto"
                },
                {
                    "caseName": "pluralES",
                    "word": "autos"
                },
                {
                    "caseName": "genderES",
                    "word": "el"
                }
            ],
            "language": "Spanish"
        },
        {
            "cases": [
                {
                    "caseName": "regularityEN",
                    "word": "regular"
                },
                {
                    "caseName": "singularEN",
                    "word": "car"
                },
                {
                    "caseName": "pluralEN",
                    "word": "cars"
                }
            ],
            "language": "English"
        }
    ]
}

const newWordIncompleteData =
{
    "clue": "Persons in the cars movies are.. ",
    "partOfSpeech": "Noun",
}

/* Closing database connection after all tests are completed. */
afterAll(async () => {
    // await Word.deleteMany(); //todo: When working on a test db this should run. To delete words created by tests
    await mongoose.connection.close();
    server.close();
});

describe("API Words test's", () => {

    let token // jwt login token
    let words // array of words saved on BE

    it("GET /api/words/simple - Should failed because of unauthorized request", async () => {
        const response = await request(app).get("/api/words/simple");
        expect(response.statusCode).toBe(401);
    });

    // FE calls this endpoint but never with params/filters
    it("GET /api/words/simple - Should get all the words of user with simplified data", async () => {
        const loginResponse = await request(app).post("/api/users/login").send({
            email: process.env.TEST_EMAIL,
            password: process.env.TEST_PASSWORD,
        });

        // saving token for next tests
        token = loginResponse.body.token

        const response = await request(app)
            .get("/api/words/simple")
            .set({
                Authorization: "Bearer " + token
            });

        expect(response.statusCode).toBe(200);
        expect(response.body.amount).toBeGreaterThan(0);
        expect(response.body.words.length).toBeGreaterThan(0);

        //setting an array of words for future tests
        words = response.body.words;
    });
    
    it("GET /api/words/ - Should get all the words of user", async () => {
        expect(token).toBeDefined();

        const response = await request(app)
            .get("/api/words/")
            .set({
                Authorization: "Bearer " + token
            });

        expect(response.statusCode).toBe(200);
        expect(response.body.length).toBeGreaterThan(0);
    });


    it("Should get a specific word by searching by id", async () => {
        expect(token).toBeDefined();
        expect(words).toBeDefined();

        const word = getRandomOfArray(words)

        const response = await request(app)
            .get(`/api/words/${word.id}`)
            .set({
                Authorization: "Bearer " + token
            });

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('_id', word.id); //check is same owrd
        expect(response.body).toHaveProperty('partOfSpeech', word.partOfSpeech); //check is same POF
    });
    
    it("Should throw error if word id does not exist", async () => {
        expect(token).toBeDefined();
        expect(words).toBeDefined();

        const id = generateRandomId()

        const response = await request(app)
            .get(`/api/words/${id}`)
            .set({
                Authorization: "Bearer " + token
            });
        expect(response.statusCode).toBe(400);
        expect(response.body).toHaveProperty('message', 'Word not found');
    });
    
    it("Should search words that match with a string", async () => {
        expect(token).toBeDefined();
        let query = "tra";
        const response = await request(app)
            .get(`/api/words/searchWord`)
            .set({
                Authorization: "Bearer " + token,
            }).query({
                query: query
            });

        expect(response.statusCode).toBe(200);
        expect(response.body.length).toBeGreaterThan(0); //
    });


    it("Should return empty array but not fail when searching empty query string", async () => {
        expect(token).toBeDefined();
        let query
        const response = await request(app)
            .get(`/api/words/searchWord`)
            .set({
                Authorization: "Bearer " + token,
            }).query({
                query: query
            });

        expect(response.statusCode).toBe(200);
        expect(response.body.length).toBe(0);
    });

    it("POST /api/words/ - Should failed because is trying to create empty word", async () => {
        expect(token).toBeDefined();

        const response = await request(app)
            .post(`/api/words/`)
            .set({
                Authorization: "Bearer " + token,
            }).send({});

        expect(response.statusCode).toBe(400);
        expect(response.body).toHaveProperty("message", "Please add part of speech");
    });


    it("POST /api/words/ - Should failed because is trying to create incomplete word", async () => {
        expect(token).toBeDefined();

        const response = await request(app)
            .post(`/api/words/`)
            .set({
                Authorization: "Bearer " + token,
            }).send(newWordIncompleteData);

        expect(response.statusCode).toBe(400);
        expect(response.body).toHaveProperty("message", "Please add 2 or more translations");
    });


    let createdWord
    it("Should create a new word", async () => {
        expect(token).toBeDefined();

        const response = await request(app)
            .post(`/api/words/`)
            .set({
                Authorization: "Bearer " + token,
            }).send(newWordData);

        createdWord = response.body

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty("partOfSpeech", newWordData.partOfSpeech);
        expect(response.body).toHaveProperty("clue", newWordData.clue);
        expect(response.body.translations.length).toBe(2);
    });


    it("Should failed trying to delete undefined id ", async () => {
        expect(token).toBeDefined();

        const response = await request(app)
            .delete(`/api/words/1`)
            .set({
                Authorization: "Bearer " + token,
            })

        expect(response.statusCode).toBe(400);
        expect(response.body).toHaveProperty("message", "Incorrect id format");
    });


    it("Should delete recently created word", async () => {
        expect(token).toBeDefined();
        expect(createdWord).toBeDefined();

        const response = await request(app)
            .delete(`/api/words/${createdWord._id}`)
            .set({
                Authorization: "Bearer " + token,
            })

        console.log(response.body)
        expect(response.statusCode).toBe(200);
    });

});