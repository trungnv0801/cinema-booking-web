import js from '@eslint/js'
import { defineConfig, globalIgnores } from 'eslint/config'
import eslintConfigPrettier from 'eslint-config-prettier'
import boundaries from 'eslint-plugin-boundaries'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import simpleImportSort from 'eslint-plugin-simple-import-sort'
import globals from 'globals'
import tseslint from 'typescript-eslint'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{js,jsx,mjs,cjs,ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
    },
    plugins: {
      'simple-import-sort': simpleImportSort,
    },
    rules: {
      'simple-import-sort/imports': [
        'error',
        {
          groups: [
            ['^react$'],
            ['^react-'],
            ['^@?\\w'],
            ['^@/'],
            ['^\\.'],
            ['^.+\\.(css|scss|sass|less)$'],
          ],
        },
      ],
      'simple-import-sort/exports': 'error',
      '@typescript-eslint/no-explicit-any': 'error',
    },
  },
  {
    files: ['scripts/**/*.mjs', '*.config.{js,ts}'],
    languageOptions: { globals: globals.node },
  },

  {
    files: ['src/**/*.{ts,tsx}'],
    plugins: { boundaries },
    settings: {
      'import/resolver': {
        typescript: { project: './tsconfig.app.json' },
      },
      'boundaries/include': ['src/**/*.ts', 'src/**/*.tsx'],
      'boundaries/elements': [
        { type: 'app', pattern: ['src/app', 'src/app/**/*'], partialMatch: false },
        {
          type: 'guest',
          pattern: ['src/contexts/guest', 'src/contexts/guest/**/*'],
          partialMatch: false,
        },
        {
          type: 'staff',
          pattern: ['src/contexts/staff', 'src/contexts/staff/**/*'],
          partialMatch: false,
        },
        { type: 'entities', pattern: ['src/entities', 'src/entities/**/*'], partialMatch: false },
        { type: 'shared', pattern: ['src/shared', 'src/shared/**/*'], partialMatch: false },
        { type: 'mocks', pattern: ['src/mocks', 'src/mocks/**/*'], partialMatch: false },
        { type: 'testing', pattern: ['src/test', 'src/test/**/*'], partialMatch: false },
      ],
      'boundaries/files': [{ category: 'test', pattern: ['**/*.test.ts', '**/*.test.tsx'] }],
    },
    rules: {
      'boundaries/dependencies': [
        'error',
        {
          default: 'disallow',
          message:
            '{{from.element.type}} may not import {{to.element.type}} — see the layer rules in eslint.config.js',
          policies: [
            { allow: { to: { module: { origin: 'external' } } } },

            {
              from: { file: { categories: 'test' } },
              allow: {
                to: {
                  element: {
                    types: {
                      anyOf: ['app', 'guest', 'staff', 'entities', 'shared', 'mocks', 'testing'],
                    },
                  },
                },
              },
            },

            {
              disallow: { to: { module: { origin: 'external', source: '@/**' } } },
              message:
                'Alias import resolved as an external package — the boundaries resolver is misconfigured',
            },

            {
              from: { element: { type: 'app' } },
              allow: {
                to: {
                  element: {
                    types: { anyOf: ['app', 'guest', 'staff', 'entities', 'shared', 'mocks'] },
                  },
                },
              },
            },

            {
              from: { element: { type: 'guest' } },
              allow: { to: { element: { types: { anyOf: ['guest', 'entities', 'shared'] } } } },
            },
            {
              from: { element: { type: 'guest' } },
              disallow: { to: { element: { type: 'staff' } } },
              message: 'guest must not import staff — push the shared piece down into entities/',
            },

            {
              from: { element: { type: 'staff' } },
              allow: { to: { element: { types: { anyOf: ['staff', 'entities', 'shared'] } } } },
            },
            {
              from: { element: { type: 'staff' } },
              disallow: { to: { element: { type: 'guest' } } },
              message: 'staff must not import guest — push the shared piece down into entities/',
            },

            {
              from: { element: { type: 'entities' } },
              allow: { to: { element: { types: { anyOf: ['entities', 'shared'] } } } },
            },
            {
              from: { element: { type: 'shared' } },
              allow: { to: { element: { type: 'shared' } } },
            },

            {
              from: { element: { type: 'mocks' } },
              allow: {
                to: {
                  element: { types: { anyOf: ['mocks', 'guest', 'staff', 'entities', 'shared'] } },
                },
              },
            },
            {
              from: { element: { type: 'testing' } },
              allow: {
                to: { element: { types: { anyOf: ['testing', 'mocks', 'entities', 'shared'] } } },
              },
            },
          ],
        },
      ],
    },
  },

  eslintConfigPrettier,
])
