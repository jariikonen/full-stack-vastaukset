module.exports = {
  env: {
    node: true,
    commonjs: true,
    es2021: true,
    jest: true,
  },
  extends: 'airbnb-base',
  overrides: [
  ],
  parserOptions: { ecmaVersion: 'latest' },
  rules: {
    'no-console': 0,
    'no-unused-vars': ['error', { args: 'none' }],
    'no-param-reassign': [
      'error',
      {
        props: true,
        ignorePropertyModificationsFor: ['accu'],
      },
    ],
    'object-curly-newline': [
      'error',
      { multiline: true, minProperties: 5 },
    ],
    'no-underscore-dangle': ['error', { allow: ['_id', '__v'] }],
  },
};
