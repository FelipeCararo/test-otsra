import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest",
  testEnvironment: "node",
  clearMocks: true,
  roots: ["<rootDir>/test"],
  verbose: true,
};
export default config;
