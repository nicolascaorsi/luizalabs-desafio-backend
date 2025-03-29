import type { Config } from 'jest';
import baseConfig from './jest.config';
const config: Config = {
  ...baseConfig,
  setupFilesAfterEnv: ['<rootDir>/__tests__/config/setup-files-after-env.ts'],
  testRegex: '.e2e-spec.ts$',
  coverageProvider: 'v8',
  coverageReporters: ['lcov'],
  coveragePathIgnorePatterns: ['__tests__/*'],
  testPathIgnorePatterns: [],
};

export default config;
