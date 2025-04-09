import { Config } from "@jest/types";

const config: Config.InitialOptions = {
  preset: "jest-expo",
  globals: {
    "ts-jest": {
      tsconfig: "tsconfig.spec.json",
      babelConfig: true,
    },
  },
  transformIgnorePatterns: [],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx"],
};

export default config;
