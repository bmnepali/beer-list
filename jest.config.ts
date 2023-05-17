const jestConfig = {
  verbose: true,
  testURL: "http://localhost/",
  transform: {
    '^.+\\.jsx?$': 'babel-jest',
  },
  testMatch: [
    "<rootDir>/src/**/?(*.)(spec|test).{js,jsx,ts,tsx}"
  ],
}

module.exports = jestConfig;
