import type { Config } from 'jest';

const config: Config = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: 'src',
  testEnvironment: 'node',
  testRegex: '.e2e-spec.ts$',
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  moduleNameMapper: {
    '^@customers/(.*)$': '<rootDir>/features/customers/$1',
    '^@config/(.*)$': '<rootDir>/config/$1',
  },
};

export default config;
