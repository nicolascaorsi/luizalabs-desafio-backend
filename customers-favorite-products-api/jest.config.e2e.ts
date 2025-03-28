import type { Config } from 'jest';

const config: Config = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  setupFilesAfterEnv: ['<rootDir>/__tests__/config/setup-files-after-env.ts'],
  rootDir: 'src',
  testEnvironment: 'node',
  testRegex: '.e2e-spec.ts$',
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  coverageProvider: 'v8',
  coverageReporters: ['lcov'],
  coveragePathIgnorePatterns: ['__tests__/*'],
  collectCoverageFrom: ['<rootDir>/**/*.ts'],
  moduleNameMapper: {
    '^@customers/(.*)$': '<rootDir>/features/customers/$1',
    '^@config/(.*)$': '<rootDir>/config/$1',
  },
};

export default config;
