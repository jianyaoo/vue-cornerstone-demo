/* eslint-env node */
module.exports = {
  root: true,
  env: {
    node: true,
    es2021: true
  },
  extends: [
    'eslint:recommended',
    'plugin:vue/vue3-essential',
    'plugin:vue/vue3-recommended',
    'plugin:vue/vue3-strongly-recommended',
    './.eslintrc-auto-import.json',
  ],
  parser: 'vue-eslint-parser',
  parserOptions: {
    ecmaVersion: 'latest',
    parser: '@babel/eslint-parser',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true
    },
    requireConfigFile: false,
  },
  rules: {
    'no-console': 'warn',
    'no-debugger': 'off',
    'no-unused-vars': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-mixed-spaces-and-tabs': 0,
  },
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx', '.vue']
      }
    }
  }
}
