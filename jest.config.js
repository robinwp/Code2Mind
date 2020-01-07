module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  'moduleFileExtensions': [
    'js',
    'json',
    'ts',
  ],
  roots: [
    "<rootDir>/test" // 测试目录
  ],
  'rootDir': '.',
  'testRegex': '.test.ts$',
  'transform': {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
};
