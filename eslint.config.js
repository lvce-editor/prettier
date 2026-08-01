import { defineConfig } from 'eslint/config'
import * as config from '@lvce-editor/eslint-config'

export default defineConfig([
  ...config.default,
  ...config.recommendedActions,
  {
    rules: {
      'github-actions/ci-versions': 'off',
      'unicorn/no-top-level-side-effects': 'off',
      '@typescript-eslint/prefer-readonly-parameter-types': 'off',
      'no-useless-escape': 'off',
    },
  },
  {
    files: ['packages/e2e/**/*.ts'],
    rules: {
      'e2e/prefer-filesystem-set-files': 'off',
    },
  },
])
