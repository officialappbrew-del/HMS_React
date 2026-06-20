import js from '@eslint/js'

export default [
  {
    files: ['**/*.{js,jsx}'],
    rules: {
      ...js.configs.recommended.rules,
      'react/jsx-uses-react': 'error',
      'react/jsx-uses-vars': 'error',
    },
    languageOptions: {
      ecmaVersion: 2020,
      globals: {
        window: 'readonly',
        document: 'readonly',
      },
    },
  },
]