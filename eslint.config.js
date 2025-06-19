const { fixupPluginRules } = require('@eslint/compat');
const { FlatCompat } = require('@eslint/eslintrc');
const js = require('@eslint/js');
const typescriptEslint = require('@typescript-eslint/eslint-plugin');
const tsParser = require('@typescript-eslint/parser');
const _import = require('eslint-plugin-import');
const jest = require('eslint-plugin-jest');
const prettier = require('eslint-plugin-prettier');
const globals = require('globals');

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

const compatExtends = compat.extends(
  'eslint:recommended',
  'plugin:import/errors',
  'plugin:import/warnings',
  'plugin:import/typescript',
  'plugin:jest/recommended',
  'plugin:prettier/recommended',
  'plugin:@typescript-eslint/eslint-recommended',
  'plugin:@typescript-eslint/recommended'
);

function cleanGlobals(obj) {
  return Object.fromEntries(Object.entries(obj).map(([key, value]) => [key.trim(), value]));
}

module.exports = [
  ...compatExtends,
  {
    files: ['**/*.{js,ts,jsx,tsx}'], // optional but safe
    settings: {
      'import/parsers': {
        '@typescript-eslint/parser': ['.ts', '.tsx'],
      },
      'import/resolver': {
        typescript: {
          project: './tsconfig.eslint.json', // or just `true` if no project file
        },
        node: {
          extensions: ['.js', '.jsx', '.ts', '.tsx'],
        },
      },
    },
    languageOptions: {
      globals: {
        ...cleanGlobals(globals.browser),
        ...cleanGlobals(globals.node),
        Atomics: 'readonly',
        SharedArrayBuffer: 'readonly',
      },
      parser: tsParser,
      ecmaVersion: 2018,
      sourceType: 'module',
      parserOptions: {
        project: './tsconfig.eslint.json',
      },
    },
    plugins: {
      '@typescript-eslint': typescriptEslint,
      prettier,
      jest,
    },
    rules: {
      '@typescript-eslint/array-type': 'error',
      '@typescript-eslint/explicit-module-boundary-types': 'error',
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-shadow': 'error',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          ignoreRestSiblings: true,
        },
      ],
      '@typescript-eslint/no-var-requires': 'off',
      curly: 'error',
      eqeqeq: 'error',
      'import/no-duplicates': 'error',
      'import/no-named-as-default': 0,
      'import/no-named-as-default-member': 0,
      'import/order': [
        'error',
        {
          alphabetize: {
            caseInsensitive: false,
            order: 'asc',
          },
          'newlines-between': 'always',
        },
      ],
      'jest/prefer-to-have-length': 'error',
      'jest/valid-expect': 'off',
      'linebreak-style': ['error', 'unix'],
      'no-console': 'warn',
      'no-prototype-builtins': 'off',
      'no-return-await': 'error',
      'no-unneeded-ternary': [
        'error',
        {
          defaultAssignment: false,
        },
      ],
      'object-curly-spacing': ['error', 'always'],
      'object-shorthand': ['error', 'properties'],
      quotes: [
        'error',
        'single',
        {
          allowTemplateLiterals: false,
          avoidEscape: true,
        },
      ],
      semi: ['error', 'always'],
      'sort-imports': [
        'error',
        {
          allowSeparatedGroups: false,
          ignoreCase: false,
          ignoreDeclarationSort: true,
          ignoreMemberSort: false,
        },
      ],
    },
  },
  {
    ignores: [
      'dist/*',
      'coverage/*',
      '**/*.d.ts',
      'src/main/public/',
      'src/main/types/',
      '**/jest.*config.js',
      '**/.eslintrc.js',
      'src/test/*/codecept.conf.js',
      'src/test/config.ts',
      '**/*.js',
    ],
  },
];
