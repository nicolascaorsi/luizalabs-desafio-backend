import type { Config } from 'jest';
import baseConfig from './jest.config';
const config: Config = {
  ...baseConfig,
  setupFilesAfterEnv: ['<rootDir>/__tests__/config/setup-files-after-env.ts'],
  testRegex: '__tests__/integration/.*.spec.ts',
  testTimeout: 30000,
  testPathIgnorePatterns: [],
};

export default config;
