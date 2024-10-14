import globals from "globals";
import pluginPrettier from 'eslint-plugin-prettier';

export default [
  {
    files: ['**/*.js'],
    languageOptions: {
      sourceType: 'commonjs',
      ecmaVersion: 12,
      globals: globals.browser,
    },
    rules: {
      indent: ['error', 2],
      'linebreak-style': ['error', 'unix'],
      quotes: ['error', 'single'],
      semi: ['error', 'always'],
      'no-unused-vars': ['warn'],
      'prettier/prettier': 'error', // Ensures Prettier rules are enforced
      'no-console': 'off',
    },
    plugins: {
      prettier: pluginPrettier, // Prettier plugin integration
    },
    extends: [
      'eslint:recommended',
      'plugin:prettier/recommended', // Integrate Prettier with ESLint
    ],
  },
];