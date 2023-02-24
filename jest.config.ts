import type { Config } from "jest";

const config: Config = {
  verbose: true,
  testPathIgnorePatterns: ["<rootDir>/node_modules/"],
  collectCoverage: true,
  coverageDirectory: "coverage",
  coverageProvider: "v8",
  roots: ["<rootDir>/src"],
  transform: {
    "^.+\\.(ts)$": "ts-jest",
  },
  moduleNameMapper: {
    "^@/(.*)": "<rootDir>/src/$1",
  },
};

export default config;
