module.exports = {
    testEnvironment: 'node',
    roots: ['<rootDir>/backend/tests'],
    setupFiles: ['<rootDir>/backend/tests/setup.js'],

    // Match both existing JS tests and future TS tests
    testMatch: [
        '**/__tests__/**/*.{js,ts}',
        '**/?(*.)+(spec|test).{js,ts}',
    ],

    // Transform TypeScript files via ts-jest so backend TS source files
    // (controllers, db, schema, etc.) can be required from JS test files
    // without a separate compile step.
    transform: {
        '^.+\\.tsx?$': [
            'ts-jest',
            {
                // Point ts-jest at the backend tsconfig
                tsconfig: '<rootDir>/backend/tsconfig.json',
                // Disable type-checking during tests for faster runs;
                // type errors are caught by the TS compiler during development.
                diagnostics: false,
            },
        ],
    },

    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
};
