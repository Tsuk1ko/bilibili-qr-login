module.exports = {
  root: true,
  env: {
    browser: true,
    es2022: true,
    node: true,
  },
  extends: [
    'plugin:vue/vue3-recommended',
    'eslint:recommended',
    '@vue/typescript/recommended',
    '@vue/prettier',
    'plugin:import/recommended',
    'plugin:import/typescript',
  ],
  parserOptions: {
    ecmaVersion: 2022,
    parser: '@typescript-eslint/parser',
  },
  rules: {
    'prefer-const': ['error', { destructuring: 'all' }],
    'no-empty': ['error', { allowEmptyCatch: true }],
    '@typescript-eslint/ban-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/ban-ts-comment': 'off',
    '@typescript-eslint/consistent-type-imports': [
      'error',
      {
        disallowTypeAnnotations: false,
        fixStyle: 'separate-type-imports',
      },
    ],
    'prettier/prettier': ['warn', {}, { usePrettierrc: true }],
    'import/order': ['warn', { groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index', 'type'] }],
    'import/no-named-as-default': 'off',
  },
  settings: {
    'import/resolver': {
      typescript: true,
      node: true,
    },
  },
};
