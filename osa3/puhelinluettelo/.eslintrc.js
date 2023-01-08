module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'plugin:react/recommended',
    'airbnb',
  ],
  overrides: [
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: [
    'react',
  ],
  rules: {
    'react/jsx-filename-extension': [1, { extensions: ['.js'] }],
    'react/function-component-definition': [2, { namedComponents: 'arrow-function' }],
    'react/prop-types': 0,
    'no-console': 0,
    'no-alert': 0,
  },
};
