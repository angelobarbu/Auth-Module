// backend/jest.config.js  (ESM)
export default /** @type {import('jest').Config} */ ({
  testEnvironment: 'node',
  rootDir: '.',
  setupFilesAfterEnv: ['<rootDir>/tests/setupDB.js'],
  globalTeardown: '<rootDir>/tests/teardownDB.js',
  transform: { '^.+\\.js$': 'babel-jest' },   // 👈 add this
  collectCoverage: true,
});