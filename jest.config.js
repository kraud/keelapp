module.exports = {
    testEnvironment: 'node',
    roots: ['<rootDir>/backend/tests'],
    setupFiles: ['<rootDir>/backend/tests/setup.js'],
    testMatch: ['**/__tests__/**/*.js', '**/?(*.)+(spec|test).js'],
};
