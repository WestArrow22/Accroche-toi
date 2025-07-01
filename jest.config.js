module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/components/**/*.test.ts'],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],
};