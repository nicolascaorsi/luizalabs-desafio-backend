import type { Config } from 'jest';

const config: Config = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: 'src',
  testRegex: '__tests__/.*.spec.ts',
  testPathIgnorePatterns: ['integration/*', 'e2e'],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  collectCoverageFrom: ['**/*.(t|j)s'],
  coveragePathIgnorePatterns: [
    'main.ts',
    '.*(\\.|-)spec\\.ts$',
    '.*\\.d\\.ts$',
    '.*.dto\\.ts$',
    '.*.module.ts',
    '.*.repository.in-memory.ts',
    '.*.test-builder.ts',
    '__generated__/',
  ],
  moduleNameMapper: {
    '^@customers/(.*)$': '<rootDir>/features/customers/$1',
    '^@config/(.*)$': '<rootDir>/config/$1',
  },
  coverageDirectory: '../coverage',
  testEnvironment: 'node',
  clearMocks: true,
  restoreMocks: true,
};

export default config;
