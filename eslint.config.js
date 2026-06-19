import * as config from '@lvce-editor/eslint-config'
import * as actions from '@lvce-editor/eslint-plugin-github-actions'

export default [
  ...config.default,
  ...actions.default,
  {
    rules: {
      'github-actions/ci-versions': 'off',
      'unicorn/no-top-level-side-effects': 'off',
      '@typescript-eslint/prefer-readonly-parameter-types': 'off',
      'no-useless-escape': 'off',
    },
  },
]
