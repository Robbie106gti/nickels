module.exports = {
  env: {
    browser: true,
    es5: true
  },
  extends: 'eslint:recommended',
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly'
  },
  parserOptions: {
    ecmaVersion: 2015
  },
  rules: {}
};
