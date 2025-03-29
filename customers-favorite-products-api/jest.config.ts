import type { Config } from 'jest';

const config: Config = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: 'src',
  testRegex: '__tests__/.*.spec.ts',
  testPathIgnorePatterns: ['integration/*', 'e2e'],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  collectCoverageFrom: ['<rootDir>/**/*.ts'],
  coveragePathIgnorePatterns: ['__tests__/*'],
  moduleNameMapper: {
    '^@customers/(.*)$': '<rootDir>/features/customers/$1',
    '^@products/(.*)$': '<rootDir>/features/products/$1',
    '^@config/(.*)$': '<rootDir>/config/$1',
    '^@errors/(.*)$': '<rootDir>/errors/$1',
  },
  coverageDirectory: '../coverage',
  testEnvironment: 'node',
  clearMocks: true,
  restoreMocks: true,
};

export default config;
