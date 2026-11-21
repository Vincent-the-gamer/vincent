import { defineConfig } from 'oxlint'

export default defineConfig({
  plugins: ['typescript', 'vue', 'node', 'unicorn', 'oxc'],
  ignorePatterns: ['dist', 'node_modules', 'public'],

  rules: {
    'no-labels': 'off',
    'no-lone-blocks': 'off',
    'prefer-rest-params': 'off',
    'symbol-description': 'off',
    'typescript/ban-types': 'off',
    'typescript/no-unnecessary-type-constraint': 'off',
  },
})
