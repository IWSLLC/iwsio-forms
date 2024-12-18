import eslint from '@eslint/js'
import stylistic from '@stylistic/eslint-plugin'
import promisePlugin from 'eslint-plugin-promise'
import reactPlugin from 'eslint-plugin-react'
import tailwind from 'eslint-plugin-tailwindcss'
import globals from 'globals'
import tseslint from 'typescript-eslint'

import jsxA11y from './lint-config/eslint-plugin-jsx-a11y.mjs'
import eslintPluginReactHooks from './lint-config/eslint-plugin-react-hooks.mjs'
import reactRefreshConfig from './lint-config/eslint-plugin-react-refresh.mjs'
import sort from './lint-config/eslint-plugin-simple-import-sort.mjs'

export default [
	...tseslint.config(
		{
			ignores: ['**/node_modules/*', '**/dist/'] // global ignore with single ignore key
		},
		// all projects:
		eslint.configs.recommended,
		...tseslint.configs.recommended,
		...jsxA11y,
		eslintPluginReactHooks,
		reactRefreshConfig,

		stylistic.configs.customize({
			braceStyle: '1tbs',
			commaDangle: 'never',
			indent: 'tab',
			jsx: true,
			quotes: 'single',
			semi: false
		}),

		sort,

		...tailwind.configs['flat/recommended'],

		{
			plugins: {
				promise: promisePlugin,
				react: reactPlugin
			},
			languageOptions: {
				ecmaVersion: 2023,
				globals: {
					...globals.browser,
					...globals.node,
					...globals.es2023
				}
			},
			rules: {
				...promisePlugin.configs.recommended.rules,
				...reactPlugin.configs.recommended.rules,
				...reactPlugin.configs['jsx-runtime'].rules,

				// custom rules here
				'promise/always-return': ['error', { ignoreLastCallback: true }],

				'tailwindcss/no-custom-classname': 'off',

				'@typescript-eslint/no-explicit-any': 'off',
				'@typescript-eslint/no-unused-vars': ['error', {
					argsIgnorePattern: '^_',
					varsIgnorePattern: '^_',
					destructuredArrayIgnorePattern: '^_',
					caughtErrorsIgnorePattern: '^_'
				}],
				'no-useless-rename': ['error', {
					ignoreDestructuring: false,
					ignoreImport: false,
					ignoreExport: false
				}],
				'object-shorthand': ['error', 'always']
			},

			settings: {
				react: {
					version: 'detect' // You can add this if you get a warning about the React version when you lint
				}
			}
		},

		// testing rules
		{
			files: ['**/*.test.ts', '**/*.test.tsx', '**/*.test.mts', '**/*.test.cts', '**/__tests__/**/*', '**/__mocks__/**/*'],
			rules: {
				'@typescript-eslint/no-unused-expressions': 'off',
				'@stylistic/max-statements-per-line': ['error', { max: 2 }]
			}
		},
		// configuration rules
		{
			files: ['**/*.config.*'],
			rules: {
				'@typescript-eslint/no-require-imports': 'off'
			}
		}
	)

]
