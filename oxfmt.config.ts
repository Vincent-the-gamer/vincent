import { defineConfig } from 'oxfmt'

export default defineConfig({
  printWidth: 120,
  tabWidth: 2,
  useTabs: false,
  semi: false,
  singleQuote: true,
  trailingComma: 'all',
  endOfLine: 'crlf',

  sortImports: {
    groups: [
      'type-import',
      ['value-builtin', 'value-external'],
      'type-internal',
      'value-internal',
      ['type-parent', 'type-sibling', 'type-index'],
      ['value-parent', 'value-sibling', 'value-index'],
      'unknown',
    ],
    newlinesBetween: false,
  },

  sortPackageJson: true,
  ignorePatterns: ['dist', 'node_modules'],
})
