// File: `jest.config.ts`
import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src', '<rootDir>/tests'],
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],
  testMatch: ['**/?(*.)+(spec|test).[tj]s?(x)'],
};

export default config;