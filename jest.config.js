module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  coverageDirectory: '<rootDir>/data/coverage',
  reporters: [
    'default',
    [
      'jest-html-reporter',
      {
        includeFailureMsg: true,
        includeSuiteFailure: true,
        sort: 'titleAsc',
        outputPath: './data/report/index.html',
      },
    ],
  ],
};