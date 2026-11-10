import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import react from 'eslint-plugin-react'

export default [
  // ── Archivos a Ignorar ──────────────────────
  {
    ignores: ['dist/**', 'node_modules/**', 'coverage/**'],
  },

  // ── Configuración Base JS ───────────────────
  js.configs.recommended,

  // ── Configuración de Código Fuente React ────
  {
    files: ['src/**/*.{js,jsx}'],
    ignores: ['src/test/**'],
    plugins: {
      react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    languageOptions: {
      ecmaVersion: 2024,
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.es2021,
      },
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    settings: {
      react: { version: 'detect' },
    },
    rules: {
      // ── React Hooks ──────────────────────
      ...reactHooks.configs.recommended.rules,

      // ── React Refresh (HMR) ──────────────
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],

      // ── React General ────────────────────
      'react/prop-types': 'warn', // warn para migración progresiva
      'react/react-in-jsx-scope': 'off', // No necesario en React 17+
      'react/jsx-uses-react': 'off',
      'react/jsx-uses-vars': 'error',
      'react/no-unused-state': 'warn',
      'react/no-array-index-key': 'warn',
      'react/self-closing-comp': 'warn',

      // ── Calidad General ──────────────────
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      // React importado pero no usado directamente (patrón React <17) → warn
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_|React' }],
      'no-debugger': 'error',
      'no-duplicate-imports': 'error',
      'prefer-const': 'error',
      eqeqeq: ['error', 'always'],
      'no-var': 'error',
      'object-shorthand': 'warn',
      'prefer-arrow-callback': 'warn',
      'prefer-template': 'warn',
    },
  },

  // ── Configuración de Archivos de Prueba ─────
  {
    files: ['src/test/**/*.{js,jsx}', '**/*.test.{js,jsx}', '**/*.spec.{js,jsx}'],
    plugins: {
      react,
      'react-hooks': reactHooks,
    },
    languageOptions: {
      ecmaVersion: 2024,
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.es2021,
        // Globals de Vitest (globals: true en vite.config.js los inyecta en runtime)
        describe: 'readonly',
        it: 'readonly',
        expect: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
        beforeAll: 'readonly',
        afterAll: 'readonly',
        vi: 'readonly',
        global: 'readonly',
      },
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    settings: {
      react: { version: 'detect' },
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react/react-in-jsx-scope': 'off',
      'react/jsx-uses-react': 'off',
      'react/jsx-uses-vars': 'error',
      'react/prop-types': 'off', // No requerido en archivos de test
      'no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_|React' }],
      'no-console': 'off', // Permitido en tests para debug
    },
  },

  // ── Archivos de Configuración ───────────────
  {
    files: ['*.config.{js,ts}', '.eslintrc.*'],
    languageOptions: {
      ecmaVersion: 2024,
      sourceType: 'module',
      globals: { ...globals.node },
    },
    rules: {
      'no-unused-vars': 'warn',
    },
  },
]
