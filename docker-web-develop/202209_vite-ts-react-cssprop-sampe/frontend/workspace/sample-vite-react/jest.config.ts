/*
 *  For a detailed explanation regarding each configuration property and type check, visit:
 *  https://jestjs.io/docs/configuration
 * 
 *  - MEMO
 *    - 「Your test suite must contain at least one test.」と出たら
 *      - jest.config.ts["testMath"]で設定したテストコードを置く場所に，テストを一切書いていないモジュールを置いていないか確認
 *  - Refs
 *    - https://stackoverflow.com/a/63627142/15842506
 *    - https://reffect.co.jp/react/react-test
 */
import type {Config} from "jest";
import {defaults} from "jest-config";

const config: Config = {
  // All imported modules in your tests should be mocked automatically
  // automock: false,

  // Stop running tests after `n` failures
  // bail: 0,

  // The directory where Jest should store its cached dependency information
  // cacheDirectory: "/tmp/jest_rs",

  // Automatically clear mock calls, instances, contexts and results before every test
  // clearMocks: true,
  clearMocks: false,

  // Indicates whether the coverage information should be collected while executing the test
  // collectCoverage: false,

  // An array of glob patterns indicating a set of files for which coverage information should be collected
  // collectCoverageFrom: undefined,

  // The directory where Jest should output its coverage files
  // coverageDirectory: undefined,
  coverageDirectory: "<rootDir>/outputs/.jest/coverage",

  // An array of regexp pattern strings used to skip coverage collection
  // coveragePathIgnorePatterns: [
  //   "/node_modules/"
  // ],

  // Indicates which provider should be used to instrument code for coverage
  coverageProvider: "v8",

  // A list of reporter names that Jest uses when writing coverage reports
  // coverageReporters: [
  //   "json",
  //   "text",
  //   "lcov",
  //   "clover"
  // ],

  // An object that configures minimum threshold enforcement for coverage results
  // coverageThreshold: undefined,

  // A path to a custom dependency extractor
  // dependencyExtractor: undefined,

  // Make calling deprecated APIs throw helpful error messages
  // errorOnDeprecated: false,

  // The default configuration for fake timers
  // fakeTimers: {
  //   "enableGlobally": false
  // },

  // Force coverage collection from ignored files using an array of glob patterns
  // forceCoverageMatch: [],

  // A path to a module which exports an async function that is triggered once before all test suites
  // globalSetup: undefined,

  // A path to a module which exports an async function that is triggered once after all test suites
  // globalTeardown: undefined,

  // A set of global variables that need to be available in all test environments
  // globals: {},
  /*
  - MEMO
    - `Define `ts-jest` config under `globals` is deprecated`と怒られたのでとりま設定しない
  */

  // The maximum amount of workers used to run your tests. Can be specified as % or a number. E.g. maxWorkers: 10% will use 10% of your CPU amount + 1 as the maximum worker number. maxWorkers: 2 will use a maximum of 2 workers.
  // maxWorkers: "50%",

  // An array of directory names to be searched recursively up from the requiring module's location
  // moduleDirectories: [
  //   "node_modules"
  // ],

  // An array of file extensions your modules use
  // moduleFileExtensions: [
  //   "js",
  //   "mjs",
  //   "cjs",
  //   "jsx",
  //   "ts",
  //   "tsx",
  //   "json",
  //   "node"
  // ],
  moduleFileExtensions: [
    "js",
    "jsx",
    "ts",
    "tsx",
    "json",
    "node",
  ],

  // A map from regular expressions to module names or to arrays of module names that allow to stub out resources with a single module
  // moduleNameMapper: {},
  /*
  - MEMO
    - vite.config.ts["resolve.alias"]やtsconfig.json["compilerOptions.paths"]に合わせる
      - https://zenn.dev/link/comments/7cac8e58c1300c
  */
  moduleNameMapper: {
    "^~/(.+)": "<rootDir>/src/main/$1",
    "^~~/(.+)": "<rootDir>/src/$1",
  },

  // An array of regexp pattern strings, matched against all module paths before considered 'visible' to the module loader
  // modulePathIgnorePatterns: [],

  // Activates notifications for test results
  // notify: false,

  // An enum that specifies notification mode. Requires { notify: true }
  // notifyMode: "failure-change",

  // A preset that is used as a base for Jest's configuration
  // preset: undefined,
  /*
  - MEMO
    - TypeScriptに対してJestが機能する設定を組み込んでくれるっぽい
      - https://blog.ojisan.io/ts-jest/
  */
  preset: "ts-jest",

  // Run tests from one or more projects
  // projects: undefined,

  // Use this configuration option to add custom reporters to Jest
  // reporters: undefined,

  // Automatically reset mock state before every test
  // resetMocks: false,

  // Reset the module registry before running each individual test
  // resetModules: false,

  // A path to a custom resolver
  // resolver: undefined,

  // Automatically restore mock state and implementation before every test
  // restoreMocks: false,

  // The root directory that Jest should scan for tests and modules within
  // rootDir: undefined,

  // A list of paths to directories that Jest should use to search for files in
  // roots: [
  //   "<rootDir>"
  // ],
  roots: [
    "<rootDir>/src"
  ],

  // Allows you to use a custom runner instead of Jest's default test runner
  // runner: "jest-runner",

  // The paths to modules that run some code to configure or set up the testing environment before each test
  // setupFiles: [],

  // A list of paths to modules that run some code to configure or set up the testing framework before each test
  // setupFilesAfterEnv: [],

  // The number of seconds after which a test is considered as slow and reported as such in the results.
  // slowTestThreshold: 5,

  // A list of paths to snapshot serializer modules Jest should use for snapshot testing
  // snapshotSerializers: [],

  // The test environment that will be used for testing
  // testEnvironment: "jest-environment-node",
  /*
  - MEMO
    - テスト環境の切り替えはdocblockをテストコード先頭に記載することで行うこととする
      - https://jestjs.io/docs/configuration#testenvironment-string
    - Jest v28以上は`jest-environment-jsdom`を別途インストールしないといけなくなったらしい
      - https://zenn.dev/keita_hino/articles/488d31e8c4a240#jsdom%E3%81%8C%E3%83%87%E3%83%95%E3%82%A9%E3%83%AB%E3%83%88%E3%81%A7%E3%81%AF%E3%82%A4%E3%83%B3%E3%82%B9%E3%83%88%E3%83%BC%E3%83%AB%E3%81%95%E3%82%8C%E3%81%AA%E3%81%8F%E3%81%AA%E3%81%A3%E3%81%9F
  */
  testEnvironment: "node",

  // Options that will be passed to the testEnvironment
  // testEnvironmentOptions: {},

  // Adds a location field to test results
  // testLocationInResults: false,

  // The glob patterns Jest uses to detect test files
  // testMatch: [
  //   "**/__tests__/**/*.[jt]s?(x)",
  //   "**/?(*.)+(spec|test).[tj]s?(x)"
  // ],
  testMatch: [
    // "**/__tests__/targets/**/*.[jt]s?(x)",
    "**/__tests__/targets/**/*.(js|jsx|ts|tsx)",
  ],

  // An array of regexp pattern strings that are matched against all test paths, matched tests are skipped
  // testPathIgnorePatterns: [
  //   "/node_modules/"
  // ],
  testPathIgnorePatterns: [
    ...defaults.testPathIgnorePatterns,
  ],

  // The regexp pattern or array of patterns that Jest uses to detect test files
  // testRegex: [],

  // This option allows the use of a custom results processor
  // testResultsProcessor: undefined,

  // This option allows use of a custom test runner
  // testRunner: "jest-circus/runner",

  // A map from regular expressions to paths to transformers
  // transform: undefined,
  /*
  - MEMO
    - SVGやCSSをReactコンポーネントとしてテストできるようにする方法
      - https://zenn.dev/link/comments/c340340ee8571d
  */
  transform: {
    "^.+\\.svg$": "<rootDir>/.jest/transformSvg.cjs",
    "^.+\\.(css|scss)$": "<rootDir>/.jest/transformStyle.cjs",
  },

  // An array of regexp pattern strings that are matched against all source file paths, matched files will skip transformation
  // transformIgnorePatterns: [
  //   "/node_modules/",
  //   "\\.pnp\\.[^\\/]+$"
  // ],

  // An array of regexp pattern strings that are matched against all modules before the module loader will automatically return a mock for them
  // unmockedModulePathPatterns: undefined,

  // Indicates whether each individual test should be reported during the run
  // verbose: undefined,

  // An array of regexp patterns that are matched against all source file paths before re-running tests in watch mode
  // watchPathIgnorePatterns: [],

  // Whether to use watchman for file crawling
  // watchman: true,
};

export default config;