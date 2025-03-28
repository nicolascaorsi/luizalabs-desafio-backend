import type { Config } from 'jest';
const config: Config = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  setupFilesAfterEnv: [
    '<rootDir>/__tests__/integration/setup-files-after-env.ts',
  ],
  rootDir: 'src',
  testRegex: '__tests__/integration/.*.spec.ts',
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  moduleNameMapper: {
    '^@customers/(.*)$': '<rootDir>/features/customers/$1',
    '^@config/(.*)$': '<rootDir>/config/$1',
  },
  testEnvironment: 'node',
  clearMocks: true,
  testTimeout: 30000,
};

export default config;
