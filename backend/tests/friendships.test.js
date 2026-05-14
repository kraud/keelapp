const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const db = require('./db');
const Friendship = require('../models/friendshipModel');
const Notification = require('../models/notificationModel');

jest.mock('../utils/sendEmail', () => jest.fn().mockResolvedValue());

beforeAll(() => db.connectDB());
beforeEach(() => db.clearDB());
afterAll(() => db.closeDB());

const registerAndLogin = async (name, email, username) => {
    await request(app).post('/api/users').send({ name, email, username, password: 'pass123' });
    const r = await request(app).post('/api/users/login').send({ email, password: 'pass123' });
    return r.body;
};

describe('Friendship Flow', () => {
    let userA, userB, userC;

    beforeEach(async () => {
        userA = await registerAndLogin('Alice', 'alice@test.com', 'alice');
        userB = await registerAndLogin('Bob', 'bob@test.com', 'bob');
        userC = await registerAndLogin('Carol', 'carol@test.com', 'carol');
    });

    const createFriendship = async (sender, recipient) => {
        return request(app)
            .post('/api/friendships').set('Authorization', `Bearer ${sender.token}`)
            .send({ userIds: [sender._id, recipient._id], status: 'pending' });
    };

    it('POST /api/friendships - sends a friend request', async () => {
        const res = await createFriendship(userA, userB);

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('status', 'pending');

        const notif = await Notification.findOne({ user: userB._id, variant: 'friend-request' });
        expect(notif).toBeDefined();
    });

    it('PUT /api/friendships/acceptRequestAndDeleteNotifications/:id - accepts request', async () => {
        const req_ = await createFriendship(userA, userB);
        const friendshipId = req_.body._id;

        const res = await request(app)
            .put(`/api/friendships/acceptRequestAndDeleteNotifications/${friendshipId}`)
            .set('Authorization', `Bearer ${userB.token}`)
            .send({ status: 'accepted' });

        expect(res.statusCode).toBe(200);

        const updated = await Friendship.findById(friendshipId);
        expect(updated.status).toBe('accepted');

        const notif = await Notification.findOne({ user: userB._id, variant: 'friend-request' });
        expect(notif).toBeNull();
    });

    it('DELETE /api/friendships/deleteRequestAndNotifications/:id - deletes a pending request', async () => {
        const req_ = await createFriendship(userA, userB);
        const friendshipId = req_.body._id;

        const res = await request(app)
            .delete(`/api/friendships/deleteRequestAndNotifications/${friendshipId}`)
            .set('Authorization', `Bearer ${userA.token}`);

        expect(res.statusCode).toBe(200);
        expect(await Friendship.findById(friendshipId)).toBeNull();
    });

    it('GET /api/friendships/getFriendships - lists friendships', async () => {
        await createFriendship(userA, userB);

        const res = await request(app)
            .get(`/api/friendships/getFriendships?userId=${userA._id}`)
            .set('Authorization', `Bearer ${userA.token}`);

        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBeGreaterThanOrEqual(1);
    });
});

describe('DELETE /api/friendships/:id - Delete Friendship', () => {
    let userA, userB;

    beforeEach(async () => {
        userA = await registerAndLogin('Alice', 'alice@test.com', 'alice');
        userB = await registerAndLogin('Bob', 'bob@test.com', 'bob');
    });

    it('deletes an accepted friendship', async () => {
        const req_ = await request(app)
            .post('/api/friendships').set('Authorization', `Bearer ${userA.token}`)
            .send({ userIds: [userA._id, userB._id], status: 'pending' });
        const friendshipId = req_.body._id;

        await request(app)
            .put(`/api/friendships/acceptRequestAndDeleteNotifications/${friendshipId}`)
            .set('Authorization', `Bearer ${userB.token}`)
            .send({ status: 'accepted' });

        const del = await request(app)
            .delete(`/api/friendships/${friendshipId}`)
            .set('Authorization', `Bearer ${userA.token}`);

        expect(del.statusCode).toBe(200);
        expect(await Friendship.findById(friendshipId)).toBeNull();
    });
});
