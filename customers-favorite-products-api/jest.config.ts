import type { Config } from 'jest';

const config: Config = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: 'src',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.ts$': '@swc/jest',
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
  coverageDirectory: '../coverage',
  testEnvironment: 'node',
  clearMocks: true,
};

export default config;
