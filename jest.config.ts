import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  verbose: true,
  testMatch: ['**/__tests__/**/*.ts?(x)', '**/?(*.)+(spec|test).ts?(x)'],
  collectCoverage: true,
  collectCoverageFrom: ['src/**/*.{ts,tsx}'],
};

export default config;
