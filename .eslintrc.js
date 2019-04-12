module.exports = {
  env: {
    browser: true,
    jquery: true,
    commonjs: true,
    es6: false
  },
  extends: ['eslint:recommended', 'jquery'],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly'
  },
  parserOptions: {
    ecmaVersion: 2015
  },
  parserOptions: {
    sourceType: 'module'
  },
  plugins: ['dollar-sign', 'jquery'],
  rules: {
    quotes: ['error', 'single'],
    'no-def': 'off',
    'one-var': 'off',
    'no-undef': 'on',
    'init-declarations': 'off',
    'no-console': 'off',
    'no-inline-comments': 'off'
  },
  overrides: {
    files: []
  },
  eslintIgnore: []
};
