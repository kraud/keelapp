const jwt = require('jsonwebtoken');

process.env.JWT_SECRET = 'test_secret';
process.env.NODE_ENV = 'test';

global.signin = (id) => {
    const userId = id.toString();
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '30d' });
};
