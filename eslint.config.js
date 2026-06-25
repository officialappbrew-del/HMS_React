import js from '@eslint/js'
import react from 'eslint-plugin-react'

export default [
  {
    files: ['**/*.{js,jsx}'],
    plugins: {
      react,
    },
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